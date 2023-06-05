import { ExtensionContext, WebviewView, WebviewViewProvider } from 'vscode';
import { WebviewResolver } from './WebviewResolver';

export class ErrorWebviewProvider implements WebviewViewProvider {
	private readonly __webviewResolver: WebviewResolver;

	public constructor(context: ExtensionContext) {
		this.__webviewResolver = new WebviewResolver(context.extensionUri);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'errors',
			JSON.stringify({}),
		);
	}
}
