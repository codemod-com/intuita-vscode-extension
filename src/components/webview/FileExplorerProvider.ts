import { WebviewView, workspace, commands } from 'vscode';
import areEqual from 'fast-deep-equal';
import { MessageBus, MessageKind } from '../messageBus';
import {
	TreeNodeId,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { JobManager } from '../jobManager';
import { CaseHash } from '../../cases/types';
import { Store } from '../../data';
import { actions } from '../../data/slice';
import { selectExplorerTree } from '../../selectors/selectExplorerTree';

type ViewProps = Extract<View, { viewId: 'fileExplorer' }>['viewProps'];

export class FileExplorer {
	__view: WebviewView | null = null;
	__lastFocusedNodeId: TreeNodeId | null = null;

	constructor(
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __store: Store,
	) {
		__store.subscribe(() => {
			this.setView();
		});
	}

	public getInitialProps(): ViewProps {
		return this.__buildViewProps();
	}

	setWebview(webviewView: WebviewView): void | Thenable<void> {
		this.__view = webviewView;

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public setView(): void {
		const viewProps = this.__buildViewProps();

		if (viewProps === null) {
			return;
		}

		this.__postMessage({
			kind: 'webview.fileExplorer.setView',
			value: {
				viewId: 'fileExplorer',
				viewProps,
			},
		});
	}

	public showView() {
		this.__view?.show(true);
	}

	public focusMostRecentNode() {
		if (this.__lastFocusedNodeId === null) {
			return;
		}
		this.__postMessage({
			kind: 'webview.fileExplorer.focusNode',
			id: this.__lastFocusedNodeId,
		});
	}

	private __buildViewProps(): ViewProps {
		const state = this.__store.getState();

		const fileTree = selectExplorerTree(
			state,
			workspace.workspaceFolders?.[0]?.uri ?? null,
		);

		return fileTree;
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}

	private __attachExtensionEventListeners() {
		let prevProps = this.__buildViewProps();

		this.__store.subscribe(() => {
			const nextProps = this.__buildViewProps();

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

	private __onDidReceiveMessage = async (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			commands.executeCommand(
				message.value.command,
				...(message.value.arguments ?? []),
			);
		}

		if (message.kind === 'webview.fileExplorer.fileSelected') {
			const caseHash = this.__store.getState().codemodRunsView
				.selectedCaseHash as CaseHash | null;

			if (caseHash === null) {
				return;
			}

			const fileNodeObj = null;
			if (fileNodeObj === null) {
				return;
			}

			const { jobHash } = fileNodeObj;
			const rootPath =
				workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
			if (rootPath === null) {
				return;
			}

			this.__messageBus.publish({
				kind: MessageKind.focusFile,
				caseHash,
				jobHash,
			});
		}

		if (message.kind === 'webview.fileExplorer.folderSelected') {
			const caseHash = this.__store.getState().codemodRunsView
				.selectedCaseHash as CaseHash | null;

			if (caseHash === null) {
				return;
			}

			const rootPath =
				workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;
			if (rootPath === null) {
				return;
			}

			const folderPath = message.id;

			this.__messageBus.publish({
				kind: MessageKind.focusFolder,
				caseHash,
				folderPath,
			});
		}

		if (message.kind === 'webview.global.focusView') {
			commands.executeCommand('intuita.focusView', message.webviewName);
		}

		if (message.kind === 'webview.fileExplorer.disposeView') {
			commands.executeCommand('intuita.disposeView', message.webviewName);
		}

		if (message.kind === 'webview.global.discardChanges') {
			commands.executeCommand('intuita.rejectCase', message.caseHash);
		}

		if (message.kind === 'webview.global.applySelected') {
			commands.executeCommand(
				'intuita.sourceControl.saveStagedJobsToTheFileSystem',
				message,
			);
		}

		if (message.kind === 'webview.global.stageJobs') {
			this.__jobManager.setAppliedJobs(message.jobHashes);
		}

		if (message.kind === 'webview.global.setChangeExplorerSearchPhrase') {
			this.__store.dispatch(
				actions.setChangeExplorerSearchPhrase(message.searchPhrase),
			);
		}

		if (message.kind === 'webview.global.selectExplorerNodeHashDigest') {
			this.__store.dispatch(
				actions.setFocusedFileExplorerNodeId(
					message.selectedExplorerNodeHashDigest,
				),
			);
		}

		if (message.kind === 'webview.global.flipChangeExplorerNodeIds') {
			this.__store.dispatch(
				actions.flipChangeExplorerHashDigests(message.hashDigest),
			);
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
