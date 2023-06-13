import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
import { CommunityProvider } from './CommunityProvider';
import { CampaignManagerProvider } from './CampaignManagerProvider';

export class MainViewProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;

	constructor(
		context: ExtensionContext,
		private readonly __community: CommunityProvider,
		private readonly __codemodRuns: CampaignManagerProvider,
	) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		const codemodRunsProps = this.__codemodRuns.getInitialProps();

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify({
				codemodRunsProps,
			}),
		);

		this.__view = webviewView;

		this.__community.resolveWebviewView(webviewView);
		this.__codemodRuns.resolveWebviewView(webviewView);
	}

	public getView(): WebviewView | null {
		return this.__view;
	}
}
