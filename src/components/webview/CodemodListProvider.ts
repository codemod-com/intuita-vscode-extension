import {
	WebviewView,
	Uri,
	EventEmitter,
	ExtensionContext,
	commands,
	workspace,
	window,
} from 'vscode';
import areEqual from 'fast-deep-equal';
import { MessageBus, MessageKind } from '../messageBus';
import { WebviewMessage, WebviewResponse } from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import { CodemodService } from '../../packageJsonAnalyzer/codemodService';
import { CodemodHash } from '../../packageJsonAnalyzer/types';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { pipe } from 'fp-ts/lib/function';
import { actions } from '../../data/slice';
import { Store } from '../../data';
import { selectCodemodTree } from '../../selectors/selectCodemodTree';
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

const getCompletionItems = (path: string) =>
	pipe(parsePath(path), ({ dir, base }) =>
		pipe(
			readDir(dir),
			TE.map((paths) => toCompletions(paths, dir, base)),
		),
	);

export class CodemodListPanel {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;
	__engineBootstrapped = false;
	__autocompleteItems: string[] = [];

	readonly __eventEmitter = new EventEmitter<void>();

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		public readonly __rootPath: string | null,
		public readonly __codemodService: CodemodService,
		private readonly __store: Store,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolver = new WebviewResolver(this.__extensionPath);

		this.__messageBus.subscribe(
			MessageKind.engineBootstrapped,
			async () => {
				this.__engineBootstrapped = true;
				this.__codemodService.fetchCodemods();
			},
		);

		this.__messageBus.subscribe(
			MessageKind.showProgress,
			this.handleCodemodExecutionProgress.bind(this),
		);

		this.__messageBus.subscribe(MessageKind.focusCodemod, (message) => {
			this.setView();

			this.__postMessage({
				kind: 'webview.codemods.focusCodemod',
				codemodHashDigest: message.codemodHashDigest,
			});
		});

		this.__messageBus.subscribe(MessageKind.codemodSetExecuted, () => {
			this.__postMessage({
				kind: 'webview.global.codemodExecutionHalted',
			});
		});

		let prevProps = this.__buildProps();

		this.__store.subscribe(() => {
			const nextProps = this.__buildProps();

			if (areEqual(prevProps, nextProps)) {
				return;
			}

			prevProps = nextProps;

			this.__postMessage({
				kind: 'webview.codemodList.setView',
				value: {
					viewId: 'codemods',
					viewProps: nextProps,
				},
			});
		});
	}

	handleCodemodExecutionProgress = ({
		processedFiles,
		totalFiles,
		codemodHash,
	}: {
		processedFiles: number;
		totalFiles: number;
		codemodHash?: CodemodHash;
	}) => {
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
	};

	isEngineBootstrapped() {
		return this.__engineBootstrapped;
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}

	private __buildProps() {
		const state = this.__store.getState();
		const { searchPhrase } = state.codemodDiscoveryView;
		console.time('select');
		const codemodTree = selectCodemodTree(state, this.__rootPath ?? '');
		console.timeEnd('select');

		return {
			searchPhrase,
			codemodTree,
			autocompleteItems: this.__autocompleteItems,
			rootPath: this.__rootPath ?? '',
		};
	}

	public getInitialProps() {
		return this.__buildProps();
	}

	public setView() {
		this.__postMessage({
			kind: 'webview.codemodList.setView',
			value: {
				viewId: 'codemods',
				viewProps: this.__buildProps(),
			},
		});
	}

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
		if (this.__rootPath === null) {
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

	setWebview(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__view = webviewView;

		this.__attachWebviewEventListeners();
	}

	private __attachWebviewEventListeners() {
		if (!this.__view?.webview) {
			return;
		}
		this.__view.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
	private __onDidReceiveMessage = async (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			if (message.value.command === 'intuita.showCodemodMetadata') {
				commands.executeCommand(
					'intuita.showCodemodMetadata',
					message.value.arguments?.[0],
				);
				return;
			}

			commands.executeCommand(
				message.value.command,
				...(message.value.arguments ?? []),
			);
		}

		if (message.kind === 'webview.codemodList.haltCodemodExecution') {
			this.__codemodService.haltCurrentCodemodExecution();
		}

		if (message.kind === 'webview.codemodList.dryRunCodemod') {
			if (this.__rootPath === null) {
				window.showWarningMessage('No active workspace is found.');
				return;
			}

			const hashDigest = message.value;
			this.__store.dispatch(actions.setRecentCodemodHashes(hashDigest));

			const state = this.__store.getState().codemodDiscoveryView;
			const executionPath =
				state.executionPaths[hashDigest] ?? this.__rootPath;

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

			this.setView();
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
}
