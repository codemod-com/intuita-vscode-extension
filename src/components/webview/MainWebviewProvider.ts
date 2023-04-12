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

export const ROOT_ELEMENT_HASH: ElementHash = '' as ElementHash;

// @TODO clean up this provider
export class IntuitaProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__elementMap = new Map<ElementHash, Element>();

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

	private __getTree = (element: Element): TreeNode => {
		const mappedNode: TreeNode = {
			id: element.hash,
		};

		mappedNode.label = 'label' in element ? element.label : 'Recipe';
		mappedNode.iconName = getElementIconBaseName(element.kind);

		if (element.kind === 'JOB') {
			mappedNode.kind = 'jobElement';

			if (element.job.kind === JobKind.rewriteFile) {
				mappedNode.command = {
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
				mappedNode.command = {
					title: 'Create File',
					command: 'vscode.open',
					arguments: [element.job.newContentUri],
				};
			}

			if (element.job.kind === JobKind.deleteFile) {
				mappedNode.command = {
					title: 'Delete File',
					command: 'vscode.open',
					arguments: [element.job.oldContentUri, 'Delete File'],
				};
			}

			if (element.job.kind === JobKind.moveAndRewriteFile) {
				mappedNode.command = {
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
				mappedNode.command = {
					title: 'Move File',
					command: 'vscode.diff',
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
		}

		if (element.kind === 'CASE') {
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
		}

		mappedNode.children =
			'children' in element ? element.children.map(this.__getTree) : [];

		if (element.kind === 'CASE') {
			mappedNode.children = element.children
				.flatMap((fileElement) => fileElement.children)
				.map(this.__getTree);
		}

		return mappedNode;
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
		if (element.kind === 'CASE') {
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

		const rootElement = {
			hash: ROOT_ELEMENT_HASH,
			kind: 'ROOT',
			children: [],
		} as RootElement;

		this.__setElement(rootElement);

		const tree = this.__getTree(rootElement);

		this.setView({
			viewId: 'treeView',
			viewProps: {
				node: tree,
			},
		});
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
			kind: 'ROOT',
			children: caseElements,
		};

		this.__elementMap.clear();
		this.__setElement(rootElement);
		const tree = this.__getTree(rootElement);
		this.setView({
			viewId: 'treeView',
			viewProps: {
				node: tree,
			},
		});
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
	}

	private __onDidReceiveMessage = (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			if (message.value.command === 'vscode.diff') {
				const args = message.value.arguments;

				if (!args?.[0]?.path || !args?.[1]?.path) {
					throw new Error(
						'Expected args[0] and args[1] to be resource Uri',
					);
				}

				const leftUri = Uri.parse(args[0].path);
				const rightUri = Uri.parse(args[1].path);
				const title = args[2];

				commands.executeCommand(
					message.value.command,
					leftUri,
					rightUri,
					title,
				);
			}

			if (message.value.command === 'vscode.open') {
				const args = message.value.arguments;
				if (!args?.[0]?.path) {
					throw new Error('Expected args[0] to be resource Uri');
				}
				const resourceUri = Uri.parse(args[0].path);

				commands.executeCommand(message.value.command, resourceUri);
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
}
