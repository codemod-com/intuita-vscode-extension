import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
import { Community } from './CommunityProvider';
import { CampaignManager } from './CampaignManagerProvider';
import { FileExplorer } from './FileExplorerProvider';
import { CodemodListPanel } from './CodemodListProvider';

export class MainViewProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;

	constructor(
		context: ExtensionContext,
		private readonly __community: Community,
		private readonly __codemodRuns: CampaignManager,
		private readonly __fileExplorer: FileExplorer,
		private readonly __codemodList: CodemodListPanel,
	) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__resolveWebview(webviewView);

		this.__view = webviewView;

		this.__community.setWebview(webviewView);
		this.__codemodRuns.setWebview(webviewView);
		this.__fileExplorer.setWebview(webviewView);
		this.__codemodList.setWebview(webviewView);

		this.__view.onDidChangeVisibility(() => {
			if (this.__view?.visible) {
				this.__resolveWebview(this.__view);
			}
		});
	}

	private __resolveWebview(webviewView: WebviewView) {
		const codemodRunsProps = this.__codemodRuns.getInitialProps();
		const fileExplorerProps = this.__fileExplorer.getInitialProps();
		const codemodListProps = this.__codemodList.getInitialProps();
		const communityProps = this.__community.getInitialProps();

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify({
				codemodRunsProps,
				fileExplorerProps,
				codemodListProps,
				communityProps,
			}),
		);
	}

	public getView(): WebviewView | null {
		return this.__view;
	}
}
