import {
	Webview,
	Uri,
	commands,
	ExtensionContext,
	WebviewPanel,
	window,
	ViewColumn,
	Disposable,
} from 'vscode';
import { randomBytes } from 'crypto';
import { MessageBus, MessageKind } from '../messageBus';

function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
	return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

type WebViewMessage = Readonly<{
	command: string;
	value: unknown;
}>;

interface ConfigurationService {
	getConfiguration(): { repositoryPath: string | undefined };
}
interface UserAccountStorage {
	getUserAccount(): string | null;
}

export class IntuitaPanel {
	private __view: Webview | null = null;
	private __extensionPath: Uri;
	private __panel: WebviewPanel | null = null;
	private __disposables: Disposable[] = [];
	static __instance: IntuitaPanel | null = null;

	static getInstance(
		context: ExtensionContext,
		configurationService: ConfigurationService,
		userAccountStorage: UserAccountStorage,
		messageBus: MessageBus,
	) {
		if (this.__instance) {
			return this.__instance;
		}

		return new IntuitaPanel(
			context,
			configurationService,
			userAccountStorage,
			messageBus,
		);
	}

	private constructor(
		context: ExtensionContext,
		private readonly __configurationService: ConfigurationService,
		private readonly __userAccountStorage: UserAccountStorage,
		private readonly __messageBus: MessageBus,
	) {
		this.__extensionPath = context.extensionUri;
		this.__panel = window.createWebviewPanel(
			'intuitaPanel',
			'Intuita Panel',
			ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					Uri.joinPath(this.__extensionPath, 'out'),
					Uri.joinPath(this.__extensionPath, 'intuita-webview/build'),
				],
				// this setting is needed to be able to communicate to webview panel when its not active (when we are on different tab)
				retainContextWhenHidden: true,
			},
		);

		this.__panel.onDidDispose(
			() => this.dispose(),
			null,
			this.__disposables,
		);
		this.__panel.webview.html = this._getHtmlForWebview(
			this.__panel.webview,
		);
		this.__view = this.__panel.webview;

		this.subscribe();
		this.activateMessageListener();
	}

	public render() {
		const initWebviewPromise = new Promise((resolve, reject) => {
			this.__panel?.reveal();
			const timeout = setTimeout(() => {
							this.__panel?.dispose();
							reject('Timeout');
				}, 5000)

			const disposable = this.__panel?.webview.onDidReceiveMessage(message => {
				if(message === 'onAfterWebviewMounted') {
					disposable?.dispose();
					clearTimeout(timeout);
					resolve('Resolved');
				}
			})
		}
		)
	
		return initWebviewPromise;
	}

	public postMessage(message: unknown) {
		if(!this.__view) {
			return;
		}

		this.__view.postMessage(message);
	}

	public dispose() {
		if (!this.__panel) {
			return;
		}
		this.__panel.dispose();

		while (this.__disposables.length) {
			const disposable = this.__disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	private subscribe() {
		[
			MessageKind.onAfterUnlinkedAccount,
			MessageKind.onAfterLinkedAccount,
			MessageKind.onAfterConfigurationChanged,
			MessageKind.onBeforeCreateIssue,
			MessageKind.onAfterCreateIssue,
		].forEach((kind) => {
			const disposable = this.__messageBus.subscribe(kind, (message) => {
				this.__view?.postMessage(message);
			});

			this.__disposables.push(disposable);
		});
	}

	private prepareWebviewInitialData = () => {
		const { repositoryPath } =
			this.__configurationService.getConfiguration();
		const userId = this.__userAccountStorage.getUserAccount();

		const result: { repositoryPath?: string; userId?: string } = {};

		if (repositoryPath) {
			result.repositoryPath = repositoryPath;
		}

		if (userId) {
			result.userId = userId;
		}

		return result;
	};

	private activateMessageListener() {
		if (!this.__view) {
			return;
		}

		this.__view.onDidReceiveMessage((message: WebViewMessage) => {
			if(!message.command) {
				return;
			}

			commands.executeCommand(message.command, message.value);
		});
	}

	private _getHtmlForWebview(webview: Webview) {
		const stylesUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			'static',
			'css',
			'main.css',
		]);
		const scriptUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			'static',
			'js',
			'main.js',
		]);

		const nonce = randomBytes(48).toString('hex');

		return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
				webview.cspSource
			}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Intuita Panel</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
					<script nonce="${nonce}">
					window.INITIAL_STATE=${JSON.stringify(this.prepareWebviewInitialData())}
					</script>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
	}
}
