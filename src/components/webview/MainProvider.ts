import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
	commands,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
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
		private readonly __codemodRuns: CampaignManager,
		private readonly __fileExplorer: FileExplorer,
		private readonly __codemodList: CodemodListPanel,
		private readonly __store: Store,
	) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	public isVisible(): boolean {
		return this.__view?.visible ?? false;
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__resolveWebview(webviewView);

		this.__view = webviewView;
		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
		this.__codemodRuns.setWebview(webviewView);
		this.__fileExplorer.setWebview(webviewView);
		this.__codemodList.setWebview(webviewView);

		this.__messageBus.publish({
			kind: MessageKind.mainWebviewViewVisibilityChange,
		});

		this.__view.onDidChangeVisibility(() => {
			this.__messageBus.publish({
				kind: MessageKind.mainWebviewViewVisibilityChange,
			});

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

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify({
				codemodRunsProps,
				fileExplorerProps,
				codemodListProps,
				activeTabId: this.__store.getState().activeTabId,
			}),
		);
	}

	private __onDidReceiveMessage = async (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			commands.executeCommand(
				message.value.command,
				...(message.value.arguments ?? []),
			);
		}

		if (message.kind === 'webview.campaignManager.setSelectedCaseHash') {
			this.__store.dispatch(
				actions.setSelectedCaseHash(message.caseHash),
			);
		}

		if (message.kind === 'webview.global.discardChanges') {
			commands.executeCommand('intuita.rejectCase', message.caseHash);
		}

		if (message.kind === 'webview.global.applySelected') {
			commands.executeCommand(
				'intuita.sourceControl.saveStagedJobsToTheFileSystem',
				message.caseHashDigest,
			);
		}

		if (message.kind === 'webview.main.setActiveTabId') {
			this.__store.dispatch(actions.setActiveTabId(message.activeTabId));
		}

		if (message.kind === 'webview.global.flipSelectedExplorerNode') {
			this.__store.dispatch(
				actions.flipSelectedExplorerNode([
					message.caseHashDigest,
					message.explorerNodeHashDigest,
				]),
			);
		}

		if (message.kind === 'webview.global.flipSelectedExplorerNodes') {
			this.__store.dispatch(
				actions.flipSelectedExplorerNodes(message.caseHashDigest),
			);
		}

		if (message.kind === 'webview.global.flipCollapsibleExplorerNode') {
			this.__store.dispatch(
				actions.flipCollapsibleExplorerNode([
					message.caseHashDigest,
					message.explorerNodeHashDigest,
				]),
			);
		}

		if (message.kind === 'webview.global.focusExplorerNode') {
			this.__store.dispatch(
				actions.focusExplorerNode([
					message.caseHashDigest,
					message.explorerNodeHashDigest,
				]),
			);
		}

		if (message.kind === 'webview.global.setChangeExplorerSearchPhrase') {
			this.__store.dispatch(
				actions.setChangeExplorerSearchPhrase([
					message.caseHashDigest,
					message.searchPhrase,
				]),
			);
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}

	public getView(): WebviewView | null {
		return this.__view;
	}
}
