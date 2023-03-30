import {
	WebviewViewProvider,
	WebviewView,
	Webview,
	Uri,
	commands,
	ExtensionContext,
} from 'vscode';
import { randomBytes } from 'crypto';
import { MessageBus, MessageKind } from '../messageBus';

function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
	return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

type WebViewMessage = {
	command: string;
	value: unknown;
}

interface ConfigurationService {
	getConfiguration(): { repositoryPath: string | undefined };
}
interface UserAccountStorage {
	getUserAccount(): string | null;
}

export class IntuitaPanel implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;

	constructor(
		context: ExtensionContext, 
		private readonly __configurationService: ConfigurationService,
		private readonly __userAccountStorage: UserAccountStorage,
		private readonly __messageBus: MessageBus,
		) {

		this.__extensionPath = context.extensionUri;
		this.__messageBus.subscribe(MessageKind.onAfterUnlinkedAccount, (message) => {
			this.__view?.webview.postMessage(message);
		});

		this.__messageBus.subscribe(MessageKind.onAfterLinkedAccount, (message) => {
			this.__view?.webview.postMessage(message);
		});

		this.__messageBus.subscribe(MessageKind.onAfterConfigurationChanged, (message) => {
			this.__view?.webview.postMessage(message);
		});
	}

	#prepareWebviewInitialData = () => {
		const {repositoryPath} = this.__configurationService.getConfiguration();
		const userId = this.__userAccountStorage.getUserAccount();

		return {
			repositoryPath, 
			userId
		}
	}

	refresh(): void {
		if (this.__view) {
			this.__view.webview.html = this._getHtmlForWebview(
				this.__view?.webview,
			);
		}
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.__extensionPath],
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
		this.__view = webviewView;
		this.activateMessageListener();
	}

	private activateMessageListener() {
		if (!this.__view) {
			return;
		}

		this.__view.webview.onDidReceiveMessage((message: WebViewMessage) => {
			commands.executeCommand(message.command, message.value);
		});
	}

	private _getHtmlForWebview(webview: Webview) {
		// The CSS file from the React build output
		const stylesUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			'static',
			'css',
			'main.css',
		]);
		// The JS file from the React build output
		const scriptUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			'static',
			'js',
			'main.js',
		]);

		const nonce = randomBytes(48).toString('hex');

		// Tip: Install the es6-string-html VS Code extension to enable code highlighting below
		return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Hello World</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
					<script nonce="${nonce}">
					window.INITIAL_STATE=${JSON.stringify(this.#prepareWebviewInitialData())}
					</script>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
	}
}
