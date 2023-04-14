import { Disposable, Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { WebviewResolver } from './WebviewResolver';
import { WebviewMessage } from './webviewEvents';
import { Message, MessageBus, MessageKind } from '../messageBus';

type PanelOptions = Readonly<{
	type: string;
	title: string;
	showOptions:
		| ViewColumn
		| {
				readonly viewColumn: ViewColumn;
				readonly preserveFocus?: boolean | undefined;
		  };
}>;

type WebviewOptions = Readonly<{
	extensionUri: Uri;
	webviewName: string;
	initialData: unknown;
}>;

export type Options = PanelOptions & WebviewOptions;

export abstract class IntuitaWebviewPanel {
	protected __panel: WebviewPanel | null = null;
	protected __disposables: Disposable[] = [];
	protected __webviewMounted = false;

	constructor(
		protected readonly options: Options,
		protected readonly __messageBus: MessageBus,
	) {
		const {
			extensionUri,
			type,
			title,
			showOptions,
			webviewName,
			initialData,
		} = options;
		const webviewResolver = new WebviewResolver(extensionUri);

		this.__panel = window.createWebviewPanel(
			type,
			title,
			showOptions,
			webviewResolver.getWebviewOptions(),
		);

		webviewResolver.resolveWebview(
			this.__panel.webview,
			webviewName,
			JSON.stringify(initialData),
		);

		this.__panel.onDidDispose(
			() => this.dispose(),
			null,
			this.__disposables,
		);

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	protected abstract __attachExtensionEventListeners(): void;
	protected abstract __attachWebviewEventListeners(): void;

	protected __postMessage(message: WebviewMessage) {
		if (!this.__panel) {
			return;
		}

		this.__panel.webview.postMessage(message);
	}

	protected __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
	}

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
}
