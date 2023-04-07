import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';
import { MessageBus } from '../messageBus';
import { WebviewResolver } from './MainWebviewResolver';

export class IntuitaProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolver  = new WebviewResolver(this.__extensionPath, this.__messageBus);
	}

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolver?.resolveWebview(this.__view.webview, {});
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if(!webviewView.webview) return;

		this.__webviewResolver?.resolveWebview(webviewView.webview, {});
		this.__view = webviewView;
	}
}
