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
	CaseTreeNode,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import { CaseElement, FileElement } from '../../elements/types';
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
import { WorkspaceState } from '../../persistedState/workspaceState';

type ViewProps = Extract<View, { viewId: 'campaignManagerView' }>['viewProps'];

const buildCaseElementsAndLatestJob = (
	rootPath: string,
	casesWithJobHashes: Iterable<CaseWithJobHashes>,
	jobMap: ReadonlyMap<JobHash, Job>,
): [ReadonlyArray<CaseElement>, Job | null] => {
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
				[JobKind.rewriteFile, JobKind.deleteFile].includes(job.kind) &&
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

			return buildFileElement(caseWithJobHashes.hash, label, children);
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
};

export class CampaignManagerProvider implements WebviewViewProvider {
	private __webviewView: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;
	__treeMap = new Map<CaseHash, CaseTreeNode>();

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		private readonly __workspaceState: WorkspaceState,
	) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	refresh(): void {
		if (!this.__webviewView) {
			return;
		}

		this.__webviewResolver.resolveWebview(
			this.__webviewView.webview,
			'campaignManager',
			'{}',
		);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewView = webviewView;

		const viewProps = this.__buildViewProps();

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'campaignManager',
			JSON.stringify({
				viewProps,
			}),
		);

		// TODO custom

		this.__webviewView.onDidChangeVisibility(() => {
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

	public showView() {
		this.__webviewView?.show();
	}

	private __postMessage(message: WebviewMessage) {
		this.__webviewView?.webview.postMessage(message);
	}

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

		const jobHashes = Array.from(casesWithJobHashes).flatMap((kase) =>
			Array.from(kase.jobHashes),
		);
		jobHashes.forEach((jobHash) => {
			const job = this.__jobManager.getJob(jobHash);

			if (!job) {
				return;
			}
			map.set(job.hash, job);
		});

		return map;
	}

	private __onClearStateMessage() {
		this.setView({
			viewId: 'campaignManagerView',
			viewProps: {
				selectedCaseHash: null,
				nodes: [],
			},
		});
	}

	private __onUpdateElementsMessage() {
		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const casesWithJobHashes = this.__caseManager.getCasesWithJobHashes();
		const jobMap = this.__buildJobMap(casesWithJobHashes);

		const [caseElements] = buildCaseElementsAndLatestJob(
			rootPath,
			casesWithJobHashes,
			jobMap,
		);

		const caseNodes = caseElements.map(this.__buildCaseTree);

		this.setView({
			viewId: 'campaignManagerView',
			viewProps: {
				selectedCaseHash: this.__workspaceState.getSelectedCaseHash(),
				nodes: caseNodes,
			},
		});
	}

	private __buildCaseTree = (element: CaseElement): CaseTreeNode => {
		const caseHash = element.hash as unknown as CaseHash;
		const mappedNode: CaseTreeNode = {
			id: caseHash,
			iconName: 'case.svg',
			label: element.label,
			kind: 'caseElement',
			children: [],
			commands: [
				{
					title: 'Diff View',
					command: 'intuita.openCaseDiff',
					arguments: [element.hash],
				},
				{
					title: 'Change Explorer',
					command: 'intuita.openChangeExplorer',
					arguments: [caseHash],
				},
			],
			caseApplied: false,
		};

		this.__treeMap.set(caseHash, mappedNode);

		return mappedNode;
	};

	private __attachExtensionEventListeners() {
		const debouncedOnUpdateElementsMessage = debounce(async () => {
			this.__onUpdateElementsMessage();
		}, 100);

		this.__addHook(MessageKind.updateElements, (message) => {
			debouncedOnUpdateElementsMessage(message);
		});

		this.__addHook(MessageKind.clearState, () =>
			this.__onClearStateMessage(),
		);

		this.__addHook(MessageKind.codemodSetExecuted, (message) => {
			if (!message.case.hash) {
				return;
			}
			commands.executeCommand('intuita.openCaseDiff', message.case.hash);
		});
	}

	private __onDidReceiveMessage = (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			commands.executeCommand(
				message.value.command,
				...(message.value.arguments ?? []),
			);
		}

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.__onUpdateElementsMessage();
		}

		if (message.kind === 'webview.campaignManager.setSelectedCaseHash') {
			this.__workspaceState.setSelectedCaseHash(message.caseHash);

			this.__onUpdateElementsMessage();
		}
	};

	private __attachWebviewEventListeners() {
		this.__webviewView?.webview.onDidReceiveMessage(
			this.__onDidReceiveMessage,
		);
	}

	private __buildViewProps(): ViewProps {
		const selectedCaseHash = this.__workspaceState.getSelectedCaseHash();

		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const casesWithJobHashes = this.__caseManager.getCasesWithJobHashes();
		const jobMap = this.__buildJobMap(casesWithJobHashes);

		const [caseElements] = buildCaseElementsAndLatestJob(
			rootPath,
			casesWithJobHashes,
			jobMap,
		);

		const nodes = caseElements.map(this.__buildCaseTree);

		return {
			selectedCaseHash,
			nodes,
		};
	}
}
