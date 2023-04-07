import {
	WebviewViewProvider,
	WebviewView,
	Webview,
	Uri,
	commands,
	ExtensionContext,
} from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { getHTML } from './getHtml';

type WebViewMessage = {
	command: string;
	value: unknown;
};

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
		[
			MessageKind.accountUnlinked,
			MessageKind.accountLinked,
			MessageKind.configurationChanged,
			MessageKind.beforeIssueCreated,
			MessageKind.afterIssueCreated,
		].forEach((kind) => {
			this.__messageBus.subscribe(kind, (message) => {
				this.__view?.webview.postMessage(message);
			});
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

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__view.webview.html = this._getHtmlForWebview(this.__view.webview);
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
		return getHTML(webview, this.__extensionPath, this.prepareWebviewInitialData());
	}
}
