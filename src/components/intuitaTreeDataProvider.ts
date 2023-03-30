import { join } from 'node:path';
import {
	Event,
	EventEmitter,
	ProviderResult,
	TreeDataProvider,
	TreeItem,
	TreeItem2,
	TreeItemCollapsibleState,
	TreeView,
	Uri,
	workspace,
} from 'vscode';
import { JobManager } from './jobManager';
import { MessageBus, MessageKind } from './messageBus';
import { CaseWithJobHashes } from '../cases/types';
import {
	CaseElement,
	JobElement,
	Element,
	ElementHash,
	FileElement,
	RootElement,
} from '../elements/types';
import {
	buildJobElement,
	compareJobElements,
} from '../elements/buildJobElement';
import {
	buildFileElement,
	compareFileElements,
} from '../elements/buildFileElement';
import {
	buildCaseElement,
	compareCaseElements,
} from '../elements/buildCaseElement';
import { Job, JobHash, JobKind } from '../jobs/types';
import type { CaseManager } from '../cases/caseManager';
import { debounce } from '../utilities';

export const ROOT_ELEMENT_HASH: ElementHash = '' as ElementHash;

const getElementIconBaseName = (kind: Element['kind']): string => {
	switch (kind) {
		case 'CASE':
			return 'case.svg';
		case 'FILE':
			return 'ts2.svg';
		default:
			return 'bluelightbulb.svg';
	}
};

export class IntuitaTreeDataProvider implements TreeDataProvider<ElementHash> {
	public readonly eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;
	readonly #elementMap = new Map<ElementHash, Element>();
	readonly #childParentMap = new Map<ElementHash, ElementHash>();
	readonly #activeJobHashes = new Set<JobHash>();
	readonly #caseManager: CaseManager;
	readonly #messageBus: MessageBus;
	readonly #jobManager: JobManager;

	#reveal: TreeView<ElementHash>['reveal'] | null = null;

	public constructor(
		caseManager: CaseManager,
		messageBus: MessageBus,
		jobManager: JobManager,
	) {
		this.#caseManager = caseManager;
		this.#messageBus = messageBus;
		this.#jobManager = jobManager;

		this.onDidChangeTreeData = this.eventEmitter.event;

		const debouncedOnUpdateElementsMessage = debounce(() => {
			return this.#onUpdateElementsMessage();
		}, 100);

		this.#messageBus.subscribe(MessageKind.updateElements, (message) =>
			debouncedOnUpdateElementsMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.clearState, () =>
			this.#onClearStateMessage(),
		);
	}

	public setReveal(reveal: TreeView<ElementHash>['reveal']) {
		this.#reveal = reveal;
	}

	public getParent(elementHash: ElementHash): ProviderResult<ElementHash> {
		return this.#childParentMap.get(elementHash);
	}

	public getChildren(elementHash: ElementHash | undefined) {
		const element = this.#elementMap.get(
			(elementHash ?? '') as ElementHash,
		);

		if (!element) {
			return [];
		}

		const hasChildren = (element: CaseElement | FileElement) =>
			element.children.length;
		const getHash = (element: CaseElement | FileElement | JobElement) =>
			element.hash;

		if (element.kind === 'ROOT') {
			return element.children.filter(hasChildren).map(getHash);
		}

		if (element.kind === 'CASE') {
			return element.children
				.flatMap((fileElement) => fileElement.children)
				.map(getHash);
		}

		if (element.kind === 'FILE') {
			return element.children.map(getHash);
		}

		return [];
	}

	public getTreeItem(
		elementHash: ElementHash,
	): TreeItem | Thenable<TreeItem> {
		const element = this.#elementMap.get(elementHash);

		if (!element) {
			throw new Error(
				`Could not find an element with hash ${elementHash}`,
			);
		}

		if (element.kind === 'ROOT') {
			throw new Error(`Cannot get a tree item for the root element`);
		}

		const treeItem = new TreeItem2(element.label);

		treeItem.id = element.hash;

		treeItem.collapsibleState =
			element.kind === 'FILE' || element.kind === 'CASE'
				? TreeItemCollapsibleState.Collapsed
				: TreeItemCollapsibleState.None;

		treeItem.iconPath = join(
			__filename,
			'..',
			'..',
			'resources',
			getElementIconBaseName(element.kind),
		);

		if (element.kind === 'JOB') {
			treeItem.contextValue = 'jobElement';

			if (element.job.kind === JobKind.rewriteFile) {
				treeItem.command = {
					title: 'Diff View',
					command: 'vscode.diff',
					arguments: [
						element.job.oldContentUri,
						element.job.newContentUri,
						'Proposed change',
					],
				};
			}

			if (element.job.kind === JobKind.createFile) {
				treeItem.command = {
					title: 'Create File',
					command: 'vscode.diff',
					arguments: [null, element.job.newContentUri, 'Create File'],
				};
			}

			if (element.job.kind === JobKind.deleteFile) {
				treeItem.command = {
					title: 'Delete File',
					command: 'vscode.diff',
					arguments: [null, element.job.oldContentUri, 'Delete File'],
				};
			}

			if (element.job.kind === JobKind.moveAndRewriteFile) {
				treeItem.command = {
					title: 'Move & Rewrite File',
					command: 'vscode.diff',
					arguments: [
						element.job.oldContentUri,
						element.job.newContentUri,
						'Proposed change',
					],
				};
			}

			if (element.job.kind === JobKind.moveFile) {
				treeItem.command = {
					title: 'Move File',
					command: 'vscode.diff',
					arguments: [
						element.job.oldContentUri,
						element.job.newContentUri,
						'Proposed change',
					],
				};
			}
		}

		if (element.kind === 'CASE') {
			treeItem.contextValue = 'caseElement';
		}

		return treeItem;
	}

	async #onUpdateElementsMessage() {
		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const casesWithJobHashes = this.#caseManager.getCasesWithJobHashes();

		const jobMap = this.#buildJobMap(casesWithJobHashes);

		const [caseElements, latestJob] = this.#buildCaseElementsAndLatestJob(
			rootPath,
			casesWithJobHashes,
			jobMap,
		);

		const rootElement: RootElement = {
			hash: ROOT_ELEMENT_HASH,
			kind: 'ROOT',
			children: caseElements,
		};

		// update collections
		this.#elementMap.clear();
		this.#childParentMap.clear();

		this.#setElement(rootElement);

		// update the UX state
		this.eventEmitter.fire();

		if (!latestJob) {
			return;
		}

		const revealTheFirstJobElement = async () => {
			if (!this.#reveal) {
				return;
			}

			await this.#reveal(latestJob.hash as unknown as ElementHash, {
				select: true,
				focus: true,
			});
		};

		const inactiveJobHashes: JobHash[] = [];

		for (const jobHash of this.#activeJobHashes) {
			if (!jobMap.has(jobHash)) {
				inactiveJobHashes.push(jobHash);
			}
		}

		for (const jobHash of jobMap.keys()) {
			this.#activeJobHashes.add(jobHash);
		}

		for (const jobHash of inactiveJobHashes) {
			this.#activeJobHashes.delete(jobHash);
		}

		setImmediate(revealTheFirstJobElement);
	}

	#onClearStateMessage() {
		this.#elementMap.clear();
		this.#childParentMap.clear();

		this.#setElement({
			hash: ROOT_ELEMENT_HASH,
			kind: 'ROOT',
			children: [],
		});

		this.eventEmitter.fire();
	}

	#setElement(element: Element) {
		this.#elementMap.set(element.hash, element);

		if (!('children' in element)) {
			return;
		}
		if (element.kind === 'CASE') {
			const jobElement = element.children.flatMap(
				(fileElement) => fileElement.children,
			);

			jobElement.forEach((childElement) => {
				this.#childParentMap.set(childElement.hash, element.hash);

				this.#setElement(childElement);
			});

			return;
		}

		element.children.forEach((childElement) => {
			this.#childParentMap.set(childElement.hash, element.hash);

			this.#setElement(childElement);
		});
	}

	#buildJobMap(
		caseDataTransferObjects: Iterable<CaseWithJobHashes>,
	): ReadonlyMap<JobHash, Job> {
		const map = new Map<JobHash, Job>();

		for (const caseDto of caseDataTransferObjects) {
			for (const jobHash of caseDto.jobHashes) {
				const job = this.#jobManager.getJob(jobHash);

				if (!job) {
					continue;
				}

				map.set(job.hash, job);
			}
		}

		return map;
	}

	#buildCaseElementsAndLatestJob(
		rootPath: string,
		casesWithJobHashes: Iterable<CaseWithJobHashes>,
		jobMap: ReadonlyMap<JobHash, Job>,
	): [ReadonlyArray<CaseElement>, Job | null] {
		let latestJob: Job | null = null;

		const unsortedCaseElements: CaseElement[] = [];

		for (const caseWithJobHashes of casesWithJobHashes) {
			const jobs: Job[] = [];

			for (const jobHash of caseWithJobHashes.jobHashes) {
				const job = jobMap.get(jobHash);

				if (job === undefined) {
					continue;
				}

				jobs.push(job);

				if (latestJob === null || latestJob.createdAt < job.createdAt) {
					latestJob = job;
				}
			}

			const uriSet = new Set<Uri>();

			for (const job of jobs) {
				if (job.kind === JobKind.createFile && job.newUri) {
					uriSet.add(job.newUri);
				}

				if (job.kind !== JobKind.createFile && job.oldUri) {
					uriSet.add(job.oldUri);
				}
			}

			const uris = Array.from(uriSet);

			const children = uris.map((uri): FileElement => {
				const label = uri.fsPath.replace(rootPath, '');

				const children = jobs
					.filter(
						(job) =>
							job.newUri?.toString() === uri.toString() ||
							job.oldUri?.toString() === uri.toString(),
					)
					.map((job) => buildJobElement(job, rootPath));

				return buildFileElement(
					caseWithJobHashes.hash,
					label,
					children,
				);
			});

			unsortedCaseElements.push(
				buildCaseElement(caseWithJobHashes, children),
			);
		}

		const sortedCaseElements = unsortedCaseElements
			.sort(compareCaseElements)
			.map((caseElement) => {
				const children = caseElement.children
					.slice()
					.sort(compareFileElements)
					.map((fileElement) => {
						const children = fileElement.children
							.slice()
							.sort(compareJobElements);

						return {
							...fileElement,
							children,
						};
					});

				return {
					...caseElement,
					children,
				};
			});

		return [sortedCaseElements, latestJob];
	}
}
