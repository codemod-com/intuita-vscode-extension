import {
	ExtensionContext,
	WebviewPanel,
	window,
	ViewColumn,
	Disposable,
	Webview,
	workspace,
	commands,
} from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { WebviewResolver } from './WebviewResolver';
import {
	JobDiffViewProps,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { JobHash, JobKind } from '../../jobs/types';
import { JobManager } from '../jobManager';
import { isNeitherNullNorUndefined } from '../../utilities';
import { ElementHash } from '../../elements/types';
import { CaseManager } from '../../cases/caseManager';
import { CaseHash } from '../../cases/types';

export class DiffWebviewPanel {
	private __view: Webview | null = null;
	private __panel: WebviewPanel | null = null;
	private __disposables: Disposable[] = [];
	private __webviewMounted = false;
	static instance: DiffWebviewPanel | null = null;

	static getInstance(
		context: ExtensionContext,
		messageBus: MessageBus,
		jobManager: JobManager,
		caseManager: CaseManager,
		rootPath: string,
	) {
		if (!DiffWebviewPanel.instance) {
			DiffWebviewPanel.instance = new DiffWebviewPanel(
				context,
				messageBus,
				jobManager,
				caseManager,
				rootPath,
			);
		}

		return DiffWebviewPanel.instance;
	}

	private constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		public readonly __rootPath: string,
	) {
		const webviewResolver = new WebviewResolver(context.extensionUri);
		this.__panel = window.createWebviewPanel(
			'intuitaPanel',
			'Diff View',
			ViewColumn.One,
			{
				...webviewResolver.getWebviewOptions(),
				// this setting is needed to be able to communicate to webview panel when its not active (when we are on different tab)
				retainContextWhenHidden: true,
			},
		);

		this.__panel.onDidDispose(
			() => this.dispose(),
			null,
			this.__disposables,
		);

		webviewResolver.resolveWebview(
			this.__panel.webview,
			'jobDiffView',
			'{}',
		);
		this.__view = this.__panel.webview;

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	private __attachWebviewEventListeners() {
		this.__panel?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
	private __onDidReceiveMessage(message: WebviewResponse) {
		if (message.kind === 'webview.command') {
			commands.executeCommand(
				message.value.command,
				message.value.arguments,
			);
		}
	}

	// @TODO move this logic to the base class
	public render() {
		const initWebviewPromise = new Promise((resolve) => {
			this.__panel?.reveal();

			if (this.__webviewMounted) {
				resolve(null);
			}

			const disposable = this.__panel?.webview.onDidReceiveMessage(
				(message) => {
					if (message.kind === 'webview.global.afterWebviewMounted') {
						disposable?.dispose();
						this.__webviewMounted = true;
						resolve(null);
					}
				},
			);
		});

		return initWebviewPromise;
	}

	public async getViewDataForJob(
		jobHash: JobHash,
	): Promise<JobDiffViewProps | null> {
		if (!this.__rootPath) {
			return null;
		}

		const job = this.__jobManager.getJob(jobHash);
		const jobAccepted = this.__jobManager.isJobAccepted(jobHash);
		if (!job) {
			return null;
		}

		const { oldUri, newUri, kind, oldContentUri, newContentUri } = job;

		const newFileTitle = newUri
			? newUri.fsPath.replace(this.__rootPath, '') ?? ''
			: null;
		const oldFileTitle = oldUri
			? oldUri.fsPath.replace(this.__rootPath, '') ?? ''
			: null;
		const newFileContent = newContentUri
			? (await workspace.fs.readFile(newContentUri)).toString()
			: null;
		const oldFileContent = oldContentUri
			? (await workspace.fs.readFile(oldContentUri)).toString()
			: null;
		const getTitle = function () {
			switch (kind) {
				case JobKind.createFile:
					return `${
						jobAccepted ? 'Created' : 'Create'
					} file ${newFileTitle}`;
				case JobKind.deleteFile:
					return `${
						jobAccepted ? 'Deleted' : 'Delete'
					} file ${oldFileTitle}`;

				case JobKind.moveFile:
					return `${
						jobAccepted ? 'Moved' : 'Move'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.moveAndRewriteFile:
					return `${
						jobAccepted ? 'Moved and rewritten' : 'Move and rewrite'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.copyFile:
					return `${
						jobAccepted ? 'Copied' : 'Copy'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.rewriteFile:
					return `${
						jobAccepted ? 'Rewritten' : 'Rewrite'
					} file ${oldFileTitle}`;

				default:
					throw new Error('unknown jobkind');
			}
		};

		return {
			jobHash,
			jobKind: kind,
			...(oldFileTitle &&
			[
				JobKind.moveFile,
				JobKind.moveAndRewriteFile,
				JobKind.copyFile,
			].includes(kind)
				? { oldFileTitle }
				: { oldFileTitle: null }),
			newFileTitle,
			oldFileContent,
			newFileContent,
			title: getTitle(),
		};
	}

	public async getViewDataForJobsArray(
		elementHash: ElementHash | JobHash[],
	): Promise<JobDiffViewProps[]> {
		const caseHash =
			typeof elementHash === 'string'
				? (elementHash as unknown as CaseHash)
				: null;

		const jobHashes =
			caseHash !== null
				? Array.from(this.__caseManager.getJobHashes([caseHash]))
				: (elementHash as JobHash[]);

		if (!jobHashes.length) {
			return [];
		}
		const viewDataArray = await Promise.all(
			jobHashes.map((jobHash) => this.getViewDataForJob(jobHash)),
		);
		return viewDataArray.filter(isNeitherNullNorUndefined);
	}

	public setView(data: View) {
		this.__panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	// @TODO move this to the base class
	public dispose() {
		DiffWebviewPanel.instance = null;

		if (!this.__panel) {
			return;
		}

		this.__panel.dispose();

		this.__disposables.forEach((disposable) => {
			disposable.dispose();
		});

		this.__disposables = [];
	}

	private __onUpdateJobMessage = async (jobHashes: ReadonlySet<JobHash>) => {
		for (const jobHash of Array.from(jobHashes)) {
			const props = await this.getViewDataForJob(jobHash);
			if (!props) continue;
			this.__postMessage({
				kind: 'webview.diffView.updateDiffViewProps',
				data: props,
			});
		}
	};

	private __postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.postMessage(message);
	}

	// @TODO move this to the base class
	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
	}

	private __attachExtensionEventListeners() {
		this.__addHook(MessageKind.jobsAccepted, (message) => {
			this.__onUpdateJobMessage(message.deletedJobHashes);
		});
	}
}
