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
import { MessageBus, MessageKind, Message } from '../messageBus';

function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
	return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

export type WebviewMessage =
	| Readonly<{
			kind: 'webview.createIssue.setFormData';
			value: Partial<{
				title: string;
				description: string;
			}>;
	  }>
	| Readonly<{
			kind: 'webview.createIssue.setLoading';
			value: boolean;
	  }>
	| Readonly<{
			kind: 'webview.global.setUserAccount';
			value: string | null;
	  }>
	| Readonly<{
			kind: 'webview.global.setConfiguration';
			value: {
				repositoryPath: string | null;
			};
	  }>;

export type WebviewResponse =
	| Readonly<{
			kind: 'webview.createIssue.submitIssue';
			value: {
				title: string;
				body: string;
			};
	  }>
	| Readonly<{
			kind: 'webview.global.redirectToSignIn';
	  }>
	| Readonly<{
			kind: 'webview.global.openConfiguration';
	  }>
	| Readonly<{
			kind: 'webview.global.afterWebviewMounted';
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
			}, 5000);

			const disposable = this.__panel?.webview.onDidReceiveMessage(
				(message: WebviewResponse) => {
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

	public setFormData(data: { title?: string; description?: string }) {
		this.postMessage({
			kind: 'webview.createIssue.setFormData',
			value: data,
		});
	}

	private postMessage(message: WebviewMessage) {
		if (!this.__view) {
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

	private addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
	}

	private subscribe() {
		[MessageKind.accountUnlinked, MessageKind.accountLinked].forEach(
			(kind) => {
				this.addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.accountLinked
							? message.account
							: null;

					this.postMessage({
						kind: 'webview.global.setUserAccount',
						value,
					});
				});
			},
		);

		this.addHook(MessageKind.configurationChanged, (message) => {
			this.postMessage({
				kind: 'webview.global.setConfiguration',
				value: {
					repositoryPath:
						message.nextConfiguration.repositoryPath ?? null,
				},
			});
		});

		[MessageKind.beforeIssueCreated, MessageKind.afterIssueCreated].forEach(
			(kind) => {
				this.addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.beforeIssueCreated;
					this.postMessage({
						kind: 'webview.createIssue.setLoading',
						value,
					});
				});
			},
		);
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

	private onDidReceiveMessage(message: WebviewResponse) {
		if (message.kind === 'webview.createIssue.submitIssue') {
			commands.executeCommand(
				'intuita.sourceControl.submitIssue',
				message.value,
			);
		}

		if (message.kind === 'webview.global.redirectToSignIn') {
			commands.executeCommand(
				'intuita.redirect',
				'https://codemod.studio/auth/sign-in',
			);
		}

		if (message.kind === 'webview.global.openConfiguration') {
			commands.executeCommand(
				'workbench.action.openSettings',
				'@ext:Intuita.intuita-vscode-extension',
			);
		}
	}

	private activateMessageListener() {
		if (!this.__view) {
			return;
		}

		this.__view.onDidReceiveMessage(this.onDidReceiveMessage);
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
