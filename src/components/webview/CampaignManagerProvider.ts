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
import {
	CaseElement,
	Element,
	ElementHash,
	FileElement,
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
import { FileExplorerProvider } from './FileExplorerProvider';

export class CampaignManagerProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__elementMap = new Map<ElementHash, Element>();

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		private readonly __fileExplorerProvider: FileExplorerProvider,
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
			'campaignManager',
			'{}',
		);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			webviewView.webview,
			'campaignManager',
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

	public showView() {
		this.__view?.show();
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
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

	private __onClearStateMessage() {
		this.setView({
			viewId: 'campaignManagerView',
			viewProps: null,
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

		const caseNodes = caseElements.map(this.__buildCaseTree);

		this.setView({
			viewId: 'campaignManagerView',
			viewProps:
				caseNodes.length > 0
					? {
							nodes: caseNodes,
					  }
					: null,
		});
	}

	private __buildCaseTree = (element: CaseElement): CaseTreeNode => {
		const actions = [
			{
				title: '✗ Discard',
				command: 'intuita.rejectCase',
				arguments: [element.hash],
			},
		];
		const caseApplied = this.__caseManager.isCaseAccepted(
			element.hash as unknown as CaseHash,
		);
		const mappedNode: CaseTreeNode = {
			id: element.hash as unknown as CaseHash,
			iconName: 'case.svg',
			label: element.label,
			kind: 'caseElement',
			children: [],
			command: {
				title: 'Diff View',
				command: 'intuita.openCaseDiff',
				arguments: [element.hash],
			},
			actions,
			caseApplied,
		};

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

		if (message.kind === 'webview.campaignManager.caseSelected') {
			this.__fileExplorerProvider.updateExplorerView(message.hash);
			this.__fileExplorerProvider.showView();
		}

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.__onUpdateElementsMessage();
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
