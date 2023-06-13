import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
import { CommunityProvider } from './CommunityProvider';
import { CampaignManagerProvider } from './CampaignManagerProvider';
import { FileExplorerProvider } from './FileExplorerProvider';
import { CodemodListPanelProvider } from './CodemodListProvider';

export class MainViewProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;

	constructor(
		context: ExtensionContext,
		private readonly __community: CommunityProvider,
		private readonly __codemodRuns: CampaignManagerProvider,
		private readonly __fileExplorer: FileExplorerProvider,
		private readonly __codemodList: CodemodListPanelProvider,
	) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		const codemodRunsProps = this.__codemodRuns.getInitialProps();
		const fileExplorerProps = this.__fileExplorer.getInitialProps();

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify({
				codemodRunsProps,
				fileExplorerProps,
			}),
		);

		this.__view = webviewView;

		this.__community.resolveWebviewView(webviewView);
		this.__codemodRuns.resolveWebviewView(webviewView);
		this.__fileExplorer.resolveWebviewView(webviewView);
		this.__codemodList.resolveWebviewView(webviewView);
	}

	public getView(): WebviewView | null {
		return this.__view;
	}
}
