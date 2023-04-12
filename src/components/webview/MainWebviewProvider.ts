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
import { debounce } from '../../utilities';
import { JobManager } from '../jobManager';
import { CaseHash, CaseWithJobHashes } from '../../cases/types';
import {
	buildJobElement,
	compareJobElements,
	jobKindCopyMap,
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

const getElementIconBaseName = (kind: Element['kind']): string => {
	switch (kind) {
		case ElementKind.CASE:
			return 'case.svg';
		case ElementKind.FILE:
			return 'ts2.svg';
		default:
			return 'bluelightbulb.svg';
	}
};

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

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
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
		const mappedNode: TreeNode = {
			id: element.hash,
		};

		mappedNode.label = 'label' in element ? element.label : 'Recipe';
		mappedNode.iconName = getElementIconBaseName(element.kind);

		if (element.kind === ElementKind.JOB) {
			this.__buildJobTree(element, mappedNode);
		}

		if (element.kind === ElementKind.CASE) {
			this.__buildCaseTree(element, mappedNode);
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
		};

		if (element.kind === ElementKind.JOB) {
			this.__buildJobTree(element, mappedNode);
			return {
				...mappedNode,
				label:
					jobKindCopyMap[element.job.kind] +
					` from ${element.job.codemodName}`,
			};
		}

		if (element.kind === ElementKind.ROOT) {
			element.children.forEach(this.__getTreeByDirectory);
			return {
				...mappedNode,
				label: 'Recipe',
				children: this.__folderMap.has(ROOT_FOLDER_KEY)
					? [this.__folderMap.get(ROOT_FOLDER_KEY) as TreeNode]
					: [],
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
			// e.g., ['/', 'packages', 'app', 'src', 'index.tsx']
			directories = ['/', ...directories];
			// e.g., 'index.tsx'
			const fileName = directories[directories.length - 1];
			let path = '';
			let node: TreeNode = { id: '' };
			for (const dir of directories) {
				const isFile = dir === fileName;
				path += `${dir.startsWith('/') ? '' : '/'}${dir}`;
				if (!this.__folderMap.has(path)) {
					const newNode = {
						id: dir,
						label: dir,
						kind: isFile ? 'fileElement' : 'folderElement',
						iconName: isFile
							? getElementIconBaseName(element.kind)
							: 'folder.svg',
						children: isFile
							? (element.children.map(
									this.__getTreeByDirectory,
							  ) as TreeNode[])
							: [],
					};

					this.__folderMap.set(path, newNode);
					node.children = [...(node.children || []), newNode];
					node = newNode;
					continue;
				}

				node = this.__folderMap.get(path) as TreeNode;
				if (isFile) {
					node.children = [
						...(node.children || []),
						...(element.children.map(
							this.__getTreeByDirectory,
						) as TreeNode[]),
					];
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

	private __attachExtensionEventListeners() {
		const debouncedOnUpdateElementsMessage = debounce(() => {
			this.__onUpdateElementsMessage();
		}, 100);

		this.__addHook(MessageKind.updateElements, (message) =>
			debouncedOnUpdateElementsMessage(message),
		);

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
			if (message.value.command === '_workbench.diff') {
				const args = message.value.arguments;

				if (!args?.[1]?.path) {
					throw new Error('Expected args[1] to be resource Uri');
				}

				const leftUri = args?.[0]?.path
					? Uri.parse(args[0].path)
					: null;
				const rightUri = Uri.parse(args[1].path);
				const title = args[2];

				commands.executeCommand(
					message.value.command,
					leftUri,
					rightUri,
					title,
				);

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

	private __buildJobTree = (
		element: JobElement,
		mappedNode: TreeNode,
	): void => {
		mappedNode.kind = 'jobElement';


		if (element.job.kind === JobKind.rewriteFile) {
			mappedNode.command = {
				title: 'Diff View',
				command: '_workbench.diff',
				arguments: [
					element.job.oldContentUri,
					element.job.newContentUri,
					'Proposed change',
				],
			};
		}

		if (element.job.kind === JobKind.createFile) {
			mappedNode.command = {
				title: 'Create File',
				command: '_workbench.diff',
				arguments: [null, element.job.newContentUri, 'Create File'],
			};
		}

		if (element.job.kind === JobKind.deleteFile) {
			mappedNode.command = {
				title: 'Delete File',
				command: '_workbench.diff',
				arguments: [null, element.job.oldContentUri, 'Delete File'],
			};
		}

		if (element.job.kind === JobKind.moveAndRewriteFile) {
			mappedNode.command = {
				title: 'Move & Rewrite File',
				command: '_workbench.diff',
				arguments: [
					element.job.oldContentUri,
					element.job.newContentUri,
					'Proposed change',
				],
			};
		}

		if (element.job.kind === JobKind.moveFile) {
			mappedNode.command = {
				title: 'Move File',
				command: '_workbench.diff',
				arguments: [
					element.job.oldContentUri,
					element.job.newContentUri,
					'Proposed change',
				],
			};
		}

		mappedNode.actions = [
			{
				title: '✓ Apply',
				command: 'intuita.acceptJob',
				arguments: [element.job.hash],
			},
			{
				title: '✗ Dismiss',
				command: 'intuita.rejectJob',
				arguments: [element.job.hash],
			},
		];

		if (this.__jobManager.isJobAccepted(element.jobHash)) {
			mappedNode.kind = 'acceptedJobElement';

			mappedNode.actions = [
				{
					title: '✗ Dismiss',
					command: 'intuita.rejectCase',
					arguments: [element.hash],
				},
				{
					title: 'Issue',
					command: 'intuita.createIssue',
					arguments: [element.job.hash],
				},
				{
					title: 'PR',
					command: 'intuita.createPR',
					arguments: [element.job.hash],
				},
			];
		}
	};

	private __buildCaseTree = (
		element: CaseElement,
		mappedNode: TreeNode,
	): void => {
		mappedNode.kind = 'caseElement';
		mappedNode.actions = [
			{
				title: '✓ Apply',
				command: 'intuita.acceptCase',
				arguments: [element.hash],
			},
			{
				title: '✗ Dismiss',
				command: 'intuita.rejectCase',
				arguments: [element.hash],
			},
		];

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
	};
}
