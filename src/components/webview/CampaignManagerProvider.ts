import { WebviewView, Uri, workspace, commands } from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { CaseTreeNode, View, WebviewMessage } from './webviewEvents';
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
import { actions } from '../../data/slice';
import { Store } from '../../data';

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

export class CampaignManager {
	private __webviewView: WebviewView | null = null;

	constructor(
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		private readonly __workspaceState: WorkspaceState,
		private readonly __store: Store,
	) {}

	setWebview(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewView = webviewView;
		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public setView() {
		const viewProps = this.__buildViewProps();

		this.__postMessage({
			kind: 'webview.codemodRuns.setView',
			value: {
				viewId: 'campaignManagerView',
				viewProps,
			},
		});
	}

	public showView() {
		this.__webviewView?.show(true);
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

	private __buildCaseTree = (element: CaseElement): CaseTreeNode => {
		const caseHash = element.hash as unknown as CaseHash;

		return {
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
	};

	private __attachExtensionEventListeners() {
		const debouncedOnUpdateElementsMessage = debounce(async () => {
			this.setView();
		}, 100);

		this.__addHook(
			MessageKind.updateElements,
			debouncedOnUpdateElementsMessage,
		);

		this.__addHook(MessageKind.clearState, () => {
			this.setView();
		});

		this.__addHook(MessageKind.upsertCases, (message) => {
			const hash = message.casesWithJobHashes[0]?.hash ?? null;

			if (hash !== null) {
				commands.executeCommand('intuita.openCaseDiff', hash);
			}
		});

		this.__addHook(MessageKind.codemodSetExecuted, (message) => {
			commands.executeCommand('intuita.openCaseDiff', message.case.hash);
		});
	}

	private __attachWebviewEventListeners() {
		if (this.__webviewView === null) {
			return;
		}

		this.__webviewView.webview.onDidReceiveMessage((message) => {
			if (message.kind === 'webview.command') {
				commands.executeCommand(
					message.value.command,
					...(message.value.arguments ?? []),
				);
			}

			if (
				message.kind === 'webview.campaignManager.setSelectedCaseHash'
			) {
				this.__workspaceState.setSelectedCaseHash(message.caseHash);
				this.__store.dispatch(
					actions.setSelectedCaseHash(message.caseHash),
				);
				this.setView();
			}
		});
	}

	public getInitialProps(): ViewProps {
		return this.__buildViewProps();
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
