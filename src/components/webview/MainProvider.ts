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
import {
	CollapsibleWebviews,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { Store } from '../../data';
import { actions } from '../../data/slice';

export class MainViewProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __community: Community,
		private readonly __codemodRuns: CampaignManager,
		private readonly __fileExplorer: FileExplorer,
		private readonly __codemodList: CodemodListPanel,
		private readonly __store: Store,
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
		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
		this.__community.setWebview(webviewView);
		this.__codemodRuns.setWebview(webviewView);
		this.__fileExplorer.setWebview(webviewView);
		this.__codemodList.setWebview(webviewView);

		this.__view.onDidChangeVisibility(() => {
			if (this.__view?.visible) {
				this.__resolveWebview(this.__view);
			}
		});

		let prevActiveTabId = this.__store.getState().activeTabId;

		this.__store.subscribe(() => {
			const nextActiveTabId = this.__store.getState().activeTabId;

			if (prevActiveTabId === nextActiveTabId) {
				return;
			}

			this.__postMessage({
				kind: 'webview.main.setActiveTabId',
				activeTabId: nextActiveTabId,
			});

			prevActiveTabId = nextActiveTabId;
		});
	}

	private __setCollapsed({
		collapsed,
		viewName,
	}: {
		collapsed: boolean;
		viewName: CollapsibleWebviews;
	}): void {
		this.__postMessage({
			kind: 'webview.main.setCollapsed',
			collapsed,
			viewName,
		});
	}

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		this.__messageBus.subscribe<T>(kind, handler);
	}

	private __attachExtensionEventListeners() {
		this.__addHook(MessageKind.executeCodemodSet, () => {
			this.__setCollapsed({
				collapsed: false,
				viewName: 'codemodRunsView',
			});
			this.__setCollapsed({
				collapsed: false,
				viewName: 'changeExplorerView',
			});
		});
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
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

	private __onDidReceiveMessage = async (message: WebviewResponse) => {
		if (message.kind === 'webview.main.setState') {
			this.__store.dispatch(actions.setActiveTabId(message.activeTabId));
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}

	public getView(): WebviewView | null {
		return this.__view;
	}
}
