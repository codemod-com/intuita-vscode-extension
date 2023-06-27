import areEqual from 'fast-deep-equal';
import {
	WebviewViewProvider,
	WebviewView,
	ExtensionContext,
	commands,
	workspace,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
import { CodemodListPanel } from './CodemodListProvider';
import { WebviewMessage, WebviewResponse } from './webviewEvents';
import { MessageBus, MessageKind } from '../messageBus';
import { Store } from '../../data';
import { actions } from '../../data/slice';

import { selectCodemodRunsTree } from '../../selectors/selectCodemodRunsTree';
import { selectExplorerTree } from '../../selectors/selectExplorerTree';

export class MainViewProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__webviewResolver: WebviewResolver;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __codemodList: CodemodListPanel,
		private readonly __store: Store,
	) {
		this.__webviewResolver = new WebviewResolver(context.extensionUri);

		this.__messageBus.subscribe(MessageKind.executeCodemodSet, () => {
			this.__postMessage({
				kind: 'webview.main.setCollapsed',
				collapsed: false,
				viewName: 'codemodRunsView',
			});

			this.__postMessage({
				kind: 'webview.main.setCollapsed',
				collapsed: false,
				viewName: 'changeExplorerView',
			});
		});
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

		this.__view.webview.onDidReceiveMessage(this.__onDidReceiveMessage);

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

		{
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

		{
			let prevProps = this.__buildCodemodRunsProps();

			this.__store.subscribe(() => {
				const nextProps = this.__buildCodemodRunsProps();

				if (areEqual(prevProps, nextProps)) {
					return;
				}

				prevProps = nextProps;

				this.__postMessage({
					kind: 'webview.codemodRuns.setView',
					value: {
						viewId: 'campaignManagerView',
						viewProps: nextProps,
					},
				});
			});
		}

		{
			let prevProps = this.__buildFileExplorerProps();

			this.__store.subscribe(() => {
				const nextProps = this.__buildFileExplorerProps();

				if (areEqual(prevProps, nextProps)) {
					return;
				}

				prevProps = nextProps;

				this.__postMessage({
					kind: 'webview.fileExplorer.setView',
					value: {
						viewId: 'fileExplorer',
						viewProps: nextProps,
					},
				});
			});
		}
	}

	private __buildCodemodRunsProps() {
		return selectCodemodRunsTree(this.__store.getState());
	}

	private __buildFileExplorerProps() {
		const state = this.__store.getState();

		return selectExplorerTree(
			state,
			workspace.workspaceFolders?.[0]?.uri ?? null,
		);
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}

	private __resolveWebview(webviewView: WebviewView) {
		const codemodListProps = this.__codemodList.getInitialProps();

		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify({
				activeTabId: this.__store.getState().activeTabId,
				codemodRunsProps: this.__buildCodemodRunsProps(),
				fileExplorerProps: this.__buildFileExplorerProps(),
				codemodListProps,
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
}
