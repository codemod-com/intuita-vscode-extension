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
		private readonly __options: Options,
		protected readonly _messageBus: MessageBus,
	) {}

	setTitle = (title: string) => {
		if (this._panel === null) {
			return;
		}

		this._panel.title = title;
	};

	protected _attachExtensionEventListeners?(): void;
	protected _attachWebviewEventListeners?(): void;

	protected _postMessage(message: WebviewMessage) {
		this._panel?.webview.postMessage(message);
	}

	public async createOrShowPanel() {
		if (this._panel !== null) {
			return this.render();
		}

		const {
			extensionUri,
			type,
			title,
			viewColumn,
			preserveFocus,
			webviewName,
			initialData,
		} = this.__options;

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

		return this.render();
	}

	protected _addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		this._messageBus.subscribe<T>(kind, handler);
	}

	public render() {
		const initWebviewPromise = new Promise((resolve) => {
			this._panel?.reveal(undefined, true);

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
		if (this._panel === null) {
			return;
		}

		this._panel.dispose();
		this._panel = null;
		this._webviewMounted = false;

		this._disposables.forEach((disposable) => {
			disposable.dispose();
		});

		this._disposables = [];
	}
}
