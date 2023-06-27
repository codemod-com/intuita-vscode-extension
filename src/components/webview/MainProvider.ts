import areEqual from 'fast-deep-equal';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import {
	WebviewViewProvider,
	WebviewView,
	ExtensionContext,
	commands,
	Uri,
	window,
	workspace,
} from 'vscode';

import { WebviewResolver } from './WebviewResolver';
import { CodemodHash, WebviewMessage, WebviewResponse } from './webviewEvents';
import { MessageBus, MessageKind } from '../messageBus';
import { Store } from '../../data';
import { actions } from '../../data/slice';

import { selectCodemodRunsTree } from '../../selectors/selectCodemodRunsTree';
import { selectExplorerTree } from '../../selectors/selectExplorerTree';
import {
	CodemodNodeHashDigest,
	selectCodemodTree,
} from '../../selectors/selectCodemodTree';
import { EngineService } from '../engineService';
import { selectMainWebviewViewProps } from '../../selectors/selectMainWebviewViewProps';

const getCompletionItems = (path: string) =>
	pipe(parsePath(path), ({ dir, base }) =>
		pipe(
			readDir(dir),
			TE.map((paths) => toCompletions(paths, dir, base)),
		),
	);

const readDir = (path: string): TE.TaskEither<Error, string[]> =>
	TE.tryCatch(
		() => readdir(path),
		(reason) => new Error(String(reason)),
	);
// parsePath should be IO?
const parsePath = (path: string): { dir: string; base: string } =>
	path.endsWith('/') ? { dir: path, base: '' } : parse(path);

const toCompletions = (paths: string[], dir: string, base: string) =>
	paths.filter((path) => path.startsWith(base)).map((c) => join(dir, c));

export class MainViewProvider implements WebviewViewProvider {
	private __view: WebviewView | null = null;
	private __webviewResolver: WebviewResolver;
	private __autocompleteItems: string[] = [];

	constructor(
		context: ExtensionContext,
		private readonly __engineService: EngineService,
		private readonly __messageBus: MessageBus,
		private readonly __rootUri: Uri,
		private readonly __store: Store,
	) {
		this.__webviewResolver = new WebviewResolver(context.extensionUri);

		this.__messageBus.subscribe(MessageKind.showProgress, (message) =>
			this.__handleCodemodExecutionProgress(message),
		);

		this.__messageBus.subscribe(MessageKind.focusCodemod, (message) => {
			this.__store.dispatch(
				actions.setFocusedCodemodHashDigest(
					message.codemodHashDigest as unknown as CodemodNodeHashDigest,
				),
			);
		});

		this.__messageBus.subscribe(MessageKind.codemodSetExecuted, () => {
			this.__postMessage({
				kind: 'webview.global.codemodExecutionHalted',
			});
		});

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
		this.__resolveWebview(webviewView);

		this.__view = webviewView;

		this.__view.webview.onDidReceiveMessage(this.__onDidReceiveMessage);

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
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}

	private __resolveWebview(webviewView: WebviewView) {
		this.__webviewResolver.resolveWebview(
			webviewView.webview,
			'main',
			JSON.stringify(this.__buildProps()),
			'mainWebviewViewProps',
		);
	}

	private __buildProps() {
		selectMainWebviewViewProps(
			this.__store.getState(),
			this.__rootUri,
			this.__autocompleteItems,
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

		if (message.kind === 'webview.codemodList.haltCodemodExecution') {
			this.__engineService.shutdownEngines();
		}

		if (message.kind === 'webview.codemodList.dryRunCodemod') {
			if (this.__rootUri === null) {
				window.showWarningMessage('No active workspace is found.');
				return;
			}

			const hashDigest = message.value;
			this.__store.dispatch(actions.setRecentCodemodHashes(hashDigest));

			const state = this.__store.getState().codemodDiscoveryView;
			const executionPath =
				state.executionPaths[hashDigest] ?? this.__rootUri.fsPath;

			if (executionPath === null) {
				return;
			}

			const uri = Uri.file(executionPath);

			commands.executeCommand('intuita.executeCodemod', uri, hashDigest);
		}

		if (message.kind === 'webview.codemodList.updatePathToExecute') {
			await this.updateExecutionPath(message.value);
		}

		if (message.kind === 'webview.global.showWarningMessage') {
			window.showWarningMessage(message.value);
		}

		if (message.kind === 'webview.codemodList.codemodPathChange') {
			const completionItemsOrError = await getCompletionItems(
				message.codemodPath,
			)();

			pipe(
				completionItemsOrError,
				E.fold(
					() => (this.__autocompleteItems = []),
					(autocompleteItems) =>
						(this.__autocompleteItems = autocompleteItems),
				),
			);
		}

		if (message.kind === 'webview.global.flipCodemodHashDigest') {
			this.__store.dispatch(
				actions.flipCodemodHashDigest(message.codemodNodeHashDigest),
			);
		}

		if (message.kind === 'webview.global.selectCodemodNodeHashDigest') {
			this.__store.dispatch(
				actions.setFocusedCodemodHashDigest(
					message.selectedCodemodNodeHashDigest,
				),
			);
		}

		if (message.kind === 'webview.global.setCodemodSearchPhrase') {
			this.__store.dispatch(
				actions.setCodemodSearchPhrase(message.searchPhrase),
			);
		}
	};

	public updateExecutionPath = async ({
		newPath,
		codemodHash,
		errorMessage,
		warningMessage,
		revertToPrevExecutionIfInvalid,
		fromVSCodeCommand,
	}: {
		newPath: string;
		codemodHash: CodemodHash;
		errorMessage: string | null;
		warningMessage: string | null;
		revertToPrevExecutionIfInvalid: boolean;
		fromVSCodeCommand?: boolean;
	}) => {
		if (this.__rootUri === null) {
			window.showWarningMessage('No active workspace is found.');
			return;
		}

		const state = this.__store.getState().codemodDiscoveryView;
		const persistedExecutionPath = state.executionPaths[codemodHash];

		const oldExecutionPath = persistedExecutionPath ?? null;

		try {
			await workspace.fs.stat(Uri.file(newPath));

			this.__store.dispatch(
				actions.setExecutionPath({ codemodHash, path: newPath }),
			);

			if (newPath !== oldExecutionPath && !fromVSCodeCommand) {
				window.showInformationMessage(
					'Successfully updated the execution path.',
				);
			}
		} catch (e) {
			if (errorMessage !== null) {
				window.showErrorMessage(errorMessage);
			}
			if (warningMessage !== null) {
				window.showWarningMessage(warningMessage);
			}

			if (oldExecutionPath === null) {
				return;
			}

			if (revertToPrevExecutionIfInvalid) {
				this.__store.dispatch(
					actions.setExecutionPath({
						codemodHash,
						path: oldExecutionPath,
					}),
				);
			} else {
				this.__store.dispatch(
					actions.setExecutionPath({
						codemodHash,
						path: oldExecutionPath,
					}),
				);
			}
		}
	};

	private __handleCodemodExecutionProgress({
		processedFiles,
		totalFiles,
		codemodHash,
	}: {
		processedFiles: number;
		totalFiles: number;
		codemodHash?: CodemodHash;
	}) {
		if (!codemodHash || totalFiles === 0) {
			return;
		}
		const progress =
			totalFiles > 0
				? Math.round((processedFiles / totalFiles) * 100)
				: 0;

		this.__postMessage({
			kind: 'webview.global.setCodemodExecutionProgress',
			value: progress,
			codemodHash,
		});
	}
}
