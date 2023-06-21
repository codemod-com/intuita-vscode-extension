import { WebviewView, workspace, commands } from 'vscode';
import areEqual from 'fast-deep-equal';
import { MessageBus, MessageKind } from '../messageBus';
import { View, WebviewMessage, WebviewResponse } from './webviewEvents';
import { JobManager } from '../jobManager';
import { Store } from '../../data';
import { actions } from '../../data/slice';
import { selectExplorerTree } from '../../selectors/selectExplorerTree';

type ViewProps = Extract<View, { viewId: 'fileExplorer' }>['viewProps'];

export class FileExplorer {
	__view: WebviewView | null = null;

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

			if (message.jobHash === null) {
				return;
			}

			this.__messageBus.publish({
				kind: MessageKind.focusFile,
				caseHash: message.caseHash,
				jobHash: message.jobHash,
			});
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
