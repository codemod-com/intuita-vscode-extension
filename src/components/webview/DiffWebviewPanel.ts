import {
	ExtensionContext,
	WebviewPanel,
	window,
	ViewColumn,
	Disposable,
	Webview,
	Uri,
} from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { WebviewResolver } from './WebviewResolver';
import { View, WebviewMessage, WebviewResponse } from './webviewEvents';

type DiffArr = [Uri | null, Uri | null, string];

export class DiffWebviewPanel {
	private __view: Webview | null = null;
	private __panel: WebviewPanel | null = null;
	private __disposables: Disposable[] = [];
	static __instance: DiffWebviewPanel | null = null;

	static getInstance(context: ExtensionContext, messageBus: MessageBus) {
		if (this.__instance) {
			return this.__instance;
		}

		return new DiffWebviewPanel(context, messageBus);
	}

	private constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
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
			'diffView',
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
