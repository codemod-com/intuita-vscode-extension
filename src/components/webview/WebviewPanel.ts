import { Disposable, Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { WebviewResolver } from './WebviewResolver';
import { WebviewMessage } from './webviewEvents';
import { Message, MessageBus, MessageKind } from '../messageBus';

type PanelOptions = Readonly<{
	type: string;
	title: string;
	viewColumn: ViewColumn;
	preserveFocus?: boolean | undefined;
}>;

type WebviewOptions = Readonly<{
	extensionUri: Uri;
	webviewName: string;
	initialData: unknown;
}>;

export type Options = PanelOptions & WebviewOptions;

export abstract class IntuitaWebviewPanel {
	protected _panel: WebviewPanel | null = null;
	protected _disposables: Disposable[] = [];
	protected _webviewMounted = false;

	constructor(
		protected readonly _options: Options,
		protected readonly _messageBus: MessageBus,
	) {
		const {
			extensionUri,
			type,
			title,
			viewColumn,
			preserveFocus,
			webviewName,
			initialData,
		} = _options;
		const webviewResolver = new WebviewResolver(extensionUri);

		this._panel = window.createWebviewPanel(
			type,
			title,
			{
				viewColumn,
				preserveFocus,
			},
			webviewResolver.getWebviewOptions(),
		);

		webviewResolver.resolveWebview(
			this._panel.webview,
			webviewName,
			JSON.stringify(initialData),
		);

		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		this._attachExtensionEventListeners?.();
		this._attachWebviewEventListeners?.();
	}

	setTitle = (title: string) => {
		if (!this._panel) {
			return;
		}

		this._panel.title = title;
	};

	protected _attachExtensionEventListeners?(): void;
	protected _attachWebviewEventListeners?(): void;

	protected _postMessage(message: WebviewMessage) {
		if (!this._panel) {
			return;
		}

		this._panel.webview.postMessage(message);
	}

	protected _addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this._messageBus.subscribe<T>(kind, handler);
		this._disposables.push(disposable);
	}

	public render() {
		const initWebviewPromise = new Promise((resolve) => {
			this._panel?.reveal();

			if (this._webviewMounted) {
				resolve(null);
			}

			const disposable = this._panel?.webview.onDidReceiveMessage(
				(message) => {
					if (message.kind === 'webview.global.afterWebviewMounted') {
						disposable?.dispose();
						this._webviewMounted = true;
						resolve(null);
					}
				},
			);
		});

		return initWebviewPromise;
	}

	public dispose() {
		if (!this._panel) {
			return;
		}
		this._panel.dispose();

		this._disposables.forEach((disposable) => {
			disposable.dispose();
		});

		this._disposables = [];
	}
}
