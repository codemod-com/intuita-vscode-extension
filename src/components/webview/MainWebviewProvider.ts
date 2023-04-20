import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
	workspace,
	commands,
} from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import {
	JobActionCommands,
	TreeNode,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import {
	CaseElement,
	Element,
	ElementHash,
	ElementKind,
	FileElement,
	RootElement,
} from '../../elements/types';
import { Job, JobHash, JobKind } from '../../jobs/types';
import {
	buildTreeRootLabel,
	debounce,
	getElementIconBaseName,
} from '../../utilities';
import { JobManager } from '../jobManager';
import { CaseHash, CaseWithJobHashes } from '../../cases/types';
import {
	buildJobElement,
	compareJobElements,
} from '../../elements/buildJobElement';
import {
	buildFileElement,
	compareFileElements,
} from '../../elements/buildFileElement';
import {
	buildCaseElement,
	compareCaseElements,
} from '../../elements/buildCaseElement';
import { CaseManager } from '../../cases/caseManager';
import { JobElement } from '../../elements/types';
import { SourceControlService } from '../sourceControl';

export const ROOT_ELEMENT_HASH: ElementHash = '' as ElementHash;
const ROOT_FOLDER_KEY = '/';

// @TODO clean up this provider
export class IntuitaProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__viewBreakdown: MessageKind.caseBreakdown | MessageKind.folderBreakdown =
		MessageKind.caseBreakdown;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__elementMap = new Map<ElementHash, Element>();
	__folderMap = new Map<string, TreeNode>();
	__unsavedChanges = false;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		private readonly __sourceControl: SourceControlService,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			this.__view.webview,
			'main',
			'{}',
		);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) return;

		this.__webviewResolver?.resolveWebview(
			webviewView.webview,
			'main',
			'{}',
		);
		this.__view = webviewView;

		this.__view.onDidChangeVisibility(() => {
			this.__onUpdateElementsMessage();
		});

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	private __postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.webview.postMessage(message);
	}

	private __getTreeByCase = (element: Element): TreeNode => {
		let mappedNode: TreeNode = {
			id: element.hash,
			kind: '',
			children: [],
		};

		mappedNode.label = 'label' in element ? element.label : 'Recipe';
		mappedNode.iconName = getElementIconBaseName(element.kind);

		if (element.kind === ElementKind.JOB) {
			mappedNode = {
				...mappedNode,
				...this.__buildJobTree(element),
			};
		}

		if (element.kind === ElementKind.CASE) {
			mappedNode = {
				...mappedNode,
				...this.__buildCaseTree(element),
			};
		}

		mappedNode.children =
			'children' in element
				? element.children.map(this.__getTreeByCase)
				: [];

		if (element.kind === ElementKind.CASE) {
			mappedNode.children = element.children
				.flatMap((fileElement) => fileElement.children)
				.map(this.__getTreeByCase);
		}

		return mappedNode;
	};

	private __getTreeByDirectory = (element: Element): TreeNode | undefined => {
		const mappedNode: TreeNode = {
			id: element.hash,
			iconName: getElementIconBaseName(element.kind),
			kind: '',
			children: [],
		};

		if (element.kind === ElementKind.ROOT) {
			element.children.forEach(this.__getTreeByDirectory);
			const treeNode = this.__folderMap.get(ROOT_FOLDER_KEY) ?? null;

			return {
				...mappedNode,
				label: element.label,
				children: treeNode !== null ? [treeNode] : [],
			};
		}

		if (element.kind === ElementKind.CASE) {
			element.children.forEach(this.__getTreeByDirectory);
		}

		if (element.kind === ElementKind.FILE) {
			// e.g., extract the path from '/packages/app/src/index.tsx (1)'
			const filePath = element.label.split(' ')[0];
			if (!filePath) {
				return;
			}

			// e.g., ['packages', 'app', 'src', 'index.tsx']
			let directories = filePath.split('/').filter((item) => item !== '');
			// e.g., ['/', 'packages', 'app', 'src']
			directories = ['/', ...directories.slice(0, -1)];
			let path = '';
			const newJobHashes = element.children.map((job) => job.jobHash);
			for (const dir of directories) {
				const parentNode = this.__folderMap.get(path) ?? null;

				path +=
					dir.endsWith('/') || path.endsWith('/') ? dir : `/${dir}`;
				if (!this.__folderMap.has(path)) {
					const jobHashesArg: JobHash[] = [];
					const newFolderNode: TreeNode = {
						id: path,
						kind: 'folderElement',
						iconName: 'folder.svg',
						children: [],
						command: {
							title: 'Diff View',
							command: 'intuita.openFolderDiff',
							arguments: jobHashesArg,
						},
						actions: [
							{
								title: '✓ Apply',
								command: 'intuita.acceptFolder',
								arguments: jobHashesArg,
							},
							{
								title: '✗ Dismiss',
								command: 'intuita.rejectFolder',
								arguments: jobHashesArg,
							},
						],
					};

					this.__folderMap.set(path, newFolderNode);

					if (parentNode !== null) {
						parentNode.children.push(newFolderNode);
					}
				}
				const currentNode = this.__folderMap.get(path) ?? null;

				if (currentNode === null || !currentNode.command?.arguments) {
					// node must exist because we create it above if it doesn't
					continue;
				}

				const existingJobHashes = currentNode.command.arguments;
				newJobHashes.forEach((jobHash) => {
					if (!existingJobHashes.includes(jobHash)) {
						existingJobHashes.push(jobHash);
					}
				});
				currentNode.label = `${dir} (${existingJobHashes.length})`;

				const folderAccepted = existingJobHashes.every((jobHash) =>
					this.__jobManager.isJobAccepted(jobHash),
				);

				if (folderAccepted) {
					currentNode.kind = 'acceptedFolderElement';

					currentNode.actions = [
						{
							title: '✗ Dismiss',
							command: 'intuita.rejectFolder',
							arguments: existingJobHashes,
						},
					];
				}

				const caseByFolderNode = this.__buildCaseByFolderTree(
					element,
					path,
				);
				if (caseByFolderNode !== null) {
					currentNode.children?.push(caseByFolderNode);
				}
			}
		}

		return;
	};

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		this.__messageBus.subscribe<T>(kind, handler);
	}

	private __buildJobMap(
		casesWithJobHashes: Iterable<CaseWithJobHashes>,
	): ReadonlyMap<JobHash, Job> {
		const map = new Map<JobHash, Job>();

		for (const kase of casesWithJobHashes) {
			for (const jobHash of kase.jobHashes) {
				const job = this.__jobManager.getJob(jobHash);

				if (!job) {
					continue;
				}

				map.set(job.hash, job);
			}
		}

		return map;
	}

	__buildCaseElementsAndLatestJob(
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
				if (
					[
						JobKind.createFile,
						JobKind.moveFile,
						JobKind.moveAndRewriteFile,
						JobKind.copyFile,
					].includes(job.kind) &&
					job.newUri
				) {
					uriSet.add(job.newUri);
				}

				if (
					[JobKind.rewriteFile, JobKind.deleteFile].includes(
						job.kind,
					) &&
					job.oldUri
				) {
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

	__setElement(element: Element) {
		this.__elementMap.set(element.hash, element);

		if (!('children' in element)) {
			return;
		}
		if (element.kind === ElementKind.CASE) {
			const jobElement = element.children.flatMap(
				(fileElement) => fileElement.children,
			);

			jobElement.forEach((childElement) => {
				this.__setElement(childElement);
			});

			return;
		}

		element.children.forEach((childElement) => {
			this.__setElement(childElement);
		});
	}

	private __onClearStateMessage() {
		this.__elementMap.clear();
		this.__folderMap.clear();

		const rootElement = {
			hash: ROOT_ELEMENT_HASH,
			kind: ElementKind.ROOT,
			children: [],
			label: '',
		} as RootElement;

		this.__setElement(rootElement);

		const tree =
			this.__viewBreakdown === MessageKind.caseBreakdown
				? this.__getTreeByCase(rootElement)
				: this.__getTreeByDirectory(rootElement);

		if (tree) {
			this.setView({
				viewId: 'treeView',
				viewProps: {
					node: tree,
				},
			});
		}
	}

	private __onViewBreakdownMessage(
		message: MessageKind.caseBreakdown | MessageKind.folderBreakdown,
	) {
		if (this.__viewBreakdown === message) {
			return;
		}

		this.__viewBreakdown = message;
		this.__onUpdateElementsMessage();
	}

	private __onUpdateElementsMessage() {
		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const casesWithJobHashes = this.__caseManager.getCasesWithJobHashes();

		const jobMap = this.__buildJobMap(casesWithJobHashes);

		const [caseElements] = this.__buildCaseElementsAndLatestJob(
			rootPath,
			casesWithJobHashes,
			jobMap,
		);

		const rootElement: RootElement = {
			hash: ROOT_ELEMENT_HASH,
			kind: ElementKind.ROOT,
			children: caseElements,
			label: buildTreeRootLabel(caseElements[0]?.label ?? null),
		};

		this.__elementMap.clear();
		this.__folderMap.clear();
		this.__setElement(rootElement);

		const tree =
			this.__viewBreakdown === MessageKind.caseBreakdown
				? this.__getTreeByCase(rootElement)
				: this.__getTreeByDirectory(rootElement);

		if (tree) {
			this.setView({
				viewId: 'treeView',
				viewProps: {
					node: tree,
				},
			});
		}
	}

	private async __getUnsavedChanges() {
		const unsavedBranches = await this.__sourceControl.getUnsavedBranches();
		this.__unsavedChanges = unsavedBranches.length !== 0;
	}

	private __attachExtensionEventListeners() {
		const debouncedOnUpdateElementsMessage = debounce(async () => {
			this.__onUpdateElementsMessage();
			await this.__getUnsavedChanges();
			this.__onUpdateElementsMessage();
		}, 100);

		this.__addHook(MessageKind.updateElements, (message) => {
			debouncedOnUpdateElementsMessage(message);
		});

		this.__addHook(MessageKind.clearState, () =>
			this.__onClearStateMessage(),
		);

		this.__addHook(MessageKind.caseBreakdown, () =>
			this.__onViewBreakdownMessage(MessageKind.caseBreakdown),
		);

		this.__addHook(MessageKind.folderBreakdown, () =>
			this.__onViewBreakdownMessage(MessageKind.folderBreakdown),
		);
	}

	private __onDidReceiveMessage = (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			if (message.value.command === 'intuita.openJobDiff') {
				const args = message.value.arguments;
				if (!args || !args[0]) {
					throw new Error('Expected args[0] to be job hash');
				}
				const jobHash = args[0];

				commands.executeCommand(message.value.command, jobHash);

				return;
			}

			commands.executeCommand(
				message.value.command,
				...(message.value.arguments ?? []),
			);
		}

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.__onUpdateElementsMessage();
		}
	};

	private __attachWebviewEventListeners() {
		if (!this.__view) {
			return;
		}

		this.__view.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}

	public static getJobActions = (
		jobHash: JobHash,
		jobManager: JobManager,
	): {
		title: string;
		command: JobActionCommands;
		arguments: JobHash[];
	}[] => {
		if (jobManager.isJobAccepted(jobHash)) {
			return [
				{
					title: '✗ Dismiss',
					command: 'intuita.rejectJob',
					arguments: [jobHash],
				},
				{
					title: 'Issue',
					command: 'intuita.createIssue',
					arguments: [jobHash],
				},
				{
					title: 'PR',
					command: 'intuita.createPR',
					arguments: [jobHash],
				},
			];
		}
		return [
			{
				title: '✓ Apply',
				command: 'intuita.acceptJob',
				arguments: [jobHash],
			},
			{
				title: '✗ Dismiss',
				command: 'intuita.rejectJob',
				arguments: [jobHash],
			},
		];
	};

	private __buildJobTree = (element: JobElement): TreeNode => {
		const mappedNode: TreeNode = {
			id: element.hash,
			kind: 'jobElement',
			children: [],
			actions: IntuitaProvider.getJobActions(
				element.job.hash,
				this.__jobManager,
			),
		};

		if (element.job.kind === JobKind.rewriteFile) {
			mappedNode.command = {
				title: 'Diff View',
				command: 'intuita.openJobDiff',
				arguments: [element.job.hash],
			};
		}

		if (element.job.kind === JobKind.createFile) {
			mappedNode.command = {
				title: 'Create File',
				command: 'intuita.openJobDiff',
				arguments: [element.job.hash],
			};
		}

		if (element.job.kind === JobKind.deleteFile) {
			mappedNode.command = {
				title: 'Delete File',
				command: 'intuita.openJobDiff',
				arguments: [element.job.hash],
			};
		}

		if (element.job.kind === JobKind.moveAndRewriteFile) {
			mappedNode.command = {
				title: 'Move & Rewrite File',
				command: 'intuita.openJobDiff',
				arguments: [element.job.hash],
			};
		}

		if (element.job.kind === JobKind.moveFile) {
			mappedNode.command = {
				title: 'Move File',
				command: 'intuita.openJobDiff',
				arguments: [element.job.hash],
			};
		}

		if (element.job.kind === JobKind.copyFile) {
			mappedNode.command = {
				title: 'Copy File',
				command: 'intuita.openJobDiff',
				arguments: [element.job.hash],
			};
		}

		if (this.__jobManager.isJobAccepted(element.jobHash)) {
			mappedNode.kind = 'acceptedJobElement';
		}
		return mappedNode;
	};

	private __buildCaseTree = (element: CaseElement): TreeNode => {
		const actions = [
			{
				title: 'Discard',
				command: 'intuita.rejectCase',
				arguments: [element.hash],
			},
			{
				title: 'Commit',
				command: 'intuita.acceptCase',
				arguments: [element.hash],
			},
		];

		const mappedNode: TreeNode = {
			id: element.hash,
			kind: 'caseElement',
			command: {
				title: 'Diff View',
				command: 'intuita.openCaseDiff',
				arguments: [element.hash],
			},
			actions,
			children: [],
		};

		const caseJobHashes = this.__caseManager.getJobHashes([
			String(element.hash) as CaseHash,
		]);
		const caseAccepted = Array.from(caseJobHashes).every((jobHash) =>
			this.__jobManager.isJobAccepted(jobHash),
		);

		if (caseAccepted) {
			mappedNode.kind = 'acceptedCaseElement';

			mappedNode.actions = [
				{
					title: '✗ Dismiss',
					command: 'intuita.rejectCase',
					arguments: [element.hash],
				},
				{
					title: 'Issue',
					command: 'intuita.createIssue',
					arguments: [element.hash],
				},
				{
					title: 'PR',
					command: 'intuita.createPR',
					arguments: [element.hash],
				},
			];
		}

		return mappedNode;
	};

	private __buildCaseByFolderTree = (
		element: FileElement,
		parentFolderPath: string,
	): TreeNode | null => {
		if (!element.children || element.children.length === 0) {
			return null;
		}

		const jobHashes = element.children.map((job) => job.jobHash);
		const codemodName = element.children[0]?.job.codemodName;
		const key = `${parentFolderPath}/${codemodName}`;
		const existingNode = this.__folderMap.get(key) ?? null;

		if (existingNode !== null && existingNode.command?.arguments) {
			const existingJobHashes = existingNode.command.arguments;
			jobHashes.forEach((jobHash) => {
				if (!existingJobHashes.includes(jobHash)) {
					existingJobHashes.push(jobHash);
				}
			});
			existingNode.label = `${codemodName} (${existingJobHashes.length})`;
		} else {
			const newNode: TreeNode = {
				id: key,
				kind: 'caseByFolderElement',
				command: {
					title: 'Diff View',
					command: 'intuita.openCaseByFolderDiff',
					arguments: jobHashes,
				},
				actions: [
					{
						title: '✓ Apply',
						command: 'intuita.acceptCaseByFolder',
						arguments: jobHashes,
					},
					{
						title: '✗ Dismiss',
						command: 'intuita.rejectCaseByFolder',
						arguments: jobHashes,
					},
				],
				label: `${codemodName} (${jobHashes.length})`,
				iconName: getElementIconBaseName(ElementKind.CASE),
				children: [],
			};
			this.__folderMap.set(key, newNode);
		}

		const node = this.__folderMap.get(key) ?? null;

		if (node === null || !node.command?.arguments) {
			// should not be reached
			return null;
		}

		const updatedJobHashes = node.command.arguments;
		const caseByFolderAccepted = updatedJobHashes.every((jobHash) =>
			this.__jobManager.isJobAccepted(jobHash),
		);

		if (caseByFolderAccepted) {
			node.kind = 'acceptedCaseByFolderElement';

			node.actions = [
				{
					title: '✗ Dismiss',
					command: 'intuita.rejectCaseByFolder',
					arguments: updatedJobHashes,
				},
			];
		}

		return existingNode === null ? node : null;
	};
}
