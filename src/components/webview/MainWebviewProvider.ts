import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';
import { MessageBus } from '../messageBus';
import { WebviewResolver } from './SourceControlWebviewResolver';

export class IntuitaProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolved: WebviewResolver | null = null;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolved  = new WebviewResolver(this.__extensionPath, this.__messageBus);
	}

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolved?.resolveWebview(this.__view.webview, {});
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if(!webviewView.webview) return;

		this.__webviewResolved?.resolveWebview(webviewView.webview, {});
		this.__view = webviewView;
	}
}
