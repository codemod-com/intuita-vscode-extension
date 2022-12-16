import { join } from 'node:path';
import {
	commands,
	Event,
	EventEmitter,
	ProviderResult,
	TreeDataProvider,
	TreeItem,
	TreeItem2,
	TreeItemCollapsibleState,
	TreeView,
	workspace,
} from 'vscode';
import { JobManager } from './jobManager';
import { Message, MessageBus, MessageKind } from './messageBus';
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
import { getFirstJobElement } from '../elements/getFirstJobElement';
import {
	buildCaseElement,
	compareCaseElements,
} from '../elements/buildCaseElement';
import { Job, JobHash, JobKind } from '../jobs/types';
import type { CaseManager } from '../cases/caseManager';
import { Configuration } from '../configuration';
import { Container } from '../container';
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
	readonly #configurationContainer: Container<Configuration>;
	readonly #messageBus: MessageBus;
	readonly #jobManager: JobManager;

	#reveal: TreeView<ElementHash>['reveal'] | null = null;

	public constructor(
		caseManager: CaseManager,
		configurationContainer: Container<Configuration>,
		messageBus: MessageBus,
		jobManager: JobManager,
	) {
		this.#caseManager = caseManager;
		this.#configurationContainer = configurationContainer;
		this.#messageBus = messageBus;
		this.#jobManager = jobManager;

		this.onDidChangeTreeData = this.eventEmitter.event;

		const debouncedOnUpdateElementsMessage = debounce(
			(message: Message & { kind: MessageKind.updateElements }) => {
				return this.#onUpdateElementsMessage(message);
			},
			1000,
		)

		this.#messageBus.subscribe((message) => {
			if (message.kind === MessageKind.updateElements) {
				debouncedOnUpdateElementsMessage(message);
			}

			if (message.kind === MessageKind.clearState) {
				setImmediate(
					() => {
						this.#onClearStateMessage();
					}
				);  
			}
		});
	}

	public setReveal(reveal: TreeView<ElementHash>['reveal']) {
		this.#reveal = reveal;
	}

	public getParent(elementHash: ElementHash): ProviderResult<ElementHash> {
		return this.#childParentMap.get(elementHash);
	}

	public getChildren(
		elementHash: ElementHash | undefined,
	): ProviderResult<ElementHash[]> {
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
			const { showFileElements } = this.#configurationContainer.get();

			if (showFileElements) {
				return element.children.filter(hasChildren).map(getHash);
			}

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

		if (
			element.kind === 'JOB' &&
			element.job.kind === JobKind.rewriteFile
		) {
			treeItem.contextValue = 'jobElement';

			treeItem.command = {
				title: 'Diff View',
				command: 'vscode.diff',
				arguments: [
					element.uri,
					element.job.outputUri,
					'Proposed change',
				],
			};
		}

		if (element.kind === 'JOB' && element.job.kind === JobKind.createFile) {
			treeItem.contextValue = 'jobElement';

			treeItem.command = {
				title: 'Open View',
				command: 'vscode.open',
				arguments: [element.job.outputUri],
			};
		}

		if (element.kind === 'CASE') {
			treeItem.contextValue = 'caseElement';
		}

		return treeItem;
	}

	async #onUpdateElementsMessage(
		message: Message & { kind: MessageKind.updateElements },
	) {
		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const casesWithJobHashes =
			this.#caseManager.getCasesWithJobHashes();

		const jobMap = this.#buildJobMap(casesWithJobHashes);

		const { showFileElements } = this.#configurationContainer.get();

		const caseElements = this.#buildCaseElements(
			rootPath,
			casesWithJobHashes,
			jobMap,
			showFileElements,
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

		const firstJobElement = getFirstJobElement(rootElement);

		// update the UX state
		this.eventEmitter.fire();

		if (!firstJobElement) {
			return;
		}

		const showTheFirstJob = async () => {
			await commands.executeCommand(
				'vscode.diff',
				firstJobElement.uri,
				firstJobElement.job.outputUri,
				'Proposed change',
			);

			if (!this.#reveal) {
				return;
			}

			await this.#reveal(firstJobElement.hash, {
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

		if (message.trigger === 'onCommand') {
			setImmediate(showTheFirstJob);

			this.#messageBus.publish({
				kind: MessageKind.persistState,
			});
		}
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

		const { showFileElements } = this.#configurationContainer.get();

		if (element.kind === 'CASE' && !showFileElements) {
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

	#buildCaseElements(
		rootPath: string,
		casesWithJobHashes: Iterable<CaseWithJobHashes>,
		jobMap: ReadonlyMap<JobHash, Job>,
		showFileElements: boolean,
	): ReadonlyArray<CaseElement> {
		const caseElements: CaseElement[] = [];

		for (const caseWithJobHashes of casesWithJobHashes) {
			const jobs: Job[] = [];

			for (const jobHash of caseWithJobHashes.jobHashes) {
				const job = jobMap.get(jobHash);

				if (job === undefined) {
					continue;
				}

				jobs.push(job);
			}

			const inputUris = Array.from(
				new Set(jobs.map((job) => job.inputUri)),
			);

			const children = inputUris.map((inputUri): FileElement => {
				const label = inputUri.fsPath.replace(rootPath, '');

				const children = jobs
					.filter(
						(job) =>
							job.inputUri.toString() === inputUri.toString(),
					)
					.map((job) =>
						buildJobElement(job, label, showFileElements),
					);

				return buildFileElement(
					caseWithJobHashes.hash,
					label,
					children,
				);
			});

			caseElements.push(buildCaseElement(caseWithJobHashes, children));
		}

		return caseElements.sort(compareCaseElements).map((caseElement) => {
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
	}
}
