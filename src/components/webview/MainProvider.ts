import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
import { CommunityProvider } from './CommunityProvider';

export class MainViewProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;

	constructor(
		context: ExtensionContext,
		private readonly __community: CommunityProvider,
	) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify({}),
		);

		this.__view = webviewView;

		this.__community.resolveWebviewView(webviewView);
	}

	public getView(): WebviewView | null {
		return this.__view;
	}
}
