import {
	ExtensionContext,
	WebviewPanel,
	window,
	ViewColumn,
	Disposable,
	Webview,
	workspace,
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

export class DiffWebviewPanel {
	private __view: Webview | null = null;
	private __panel: WebviewPanel | null = null;
	private __disposables: Disposable[] = [];
	static __instance: DiffWebviewPanel | null = null;

	static getInstance(
		context: ExtensionContext,
		messageBus: MessageBus,
		jobManager: JobManager,
	) {
		if (this.__instance) {
			return this.__instance;
		}

		return new DiffWebviewPanel(context, messageBus, jobManager);
	}

	private constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
	) {
		const webviewResolver = new WebviewResolver(context.extensionUri);
		this.__panel = window.createWebviewPanel(
			'intuitaPanel',
			'Intuita Panel',
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
			JSON.stringify(this.__prepareWebviewInitialData()),
		);
		this.__view = this.__panel.webview;

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public render() {
		const initWebviewPromise = new Promise((resolve, reject) => {
			this.__panel?.reveal();

			const timeout = setTimeout(() => {
				this.__panel?.dispose();
				reject('Timeout');
			}, 5000);

			const disposable = this.__panel?.webview.onDidReceiveMessage(
				(message) => {
					if (message.kind === 'webview.global.afterWebviewMounted') {
						disposable?.dispose();
						clearTimeout(timeout);
						resolve('Resolved');
					}
				},
			);
		});

		return initWebviewPromise;
	}
	public async getViewData(
		jobHash: JobHash,
		rootPath: string | null,
	): Promise<JobDiffViewProps | null> {
		if (!rootPath) {
			return null;
		}

		const job = this.__jobManager.getJob(jobHash);
		if (!job) {
			return null;
		}

		const { oldUri, newUri, kind, oldContentUri, newContentUri } = job;

		const newFileTitle = newUri
			? newUri.fsPath.replace(rootPath, '') ?? ''
			: null;
		const oldFileTitle = oldUri
			? oldUri.fsPath.replace(rootPath, '') ?? ''
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
					return `Create file ${newFileTitle}`;
				case JobKind.deleteFile:
					return `Delete file ${oldFileTitle}`;
				case JobKind.moveFile:
					return `Move file ${oldFileTitle} to ${newFileTitle}`;
				case JobKind.moveAndRewriteFile:
					return `Move and rewrite file ${oldFileTitle} to ${newFileTitle}`;
				case JobKind.copyFile:
					return `Copy file ${oldFileTitle} to ${newFileTitle}`;
				case JobKind.rewriteFile:
					return `Rewrite file ${oldFileTitle}`;
				default:
					throw new Error('unknown jobkind');
			}
		};

		return {
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

	public setView(data: View) {
		this.__panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	public dispose() {
		if (!this.__panel) {
			return;
		}
		this.__panel.dispose();

		this.__disposables.forEach((disposable) => {
			disposable.dispose();
		});

		this.__disposables = [];
	}

	private __prepareWebviewInitialData = () => {
		/** empty */
	};

	private __postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.postMessage(message);
	}

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
	}

	private __attachExtensionEventListeners() {
		// TODO: change events here
	}

	private __onDidReceiveMessage(message: WebviewResponse) {
		// TODO: change events here
	}

	private __attachWebviewEventListeners() {
		this.__view?.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
