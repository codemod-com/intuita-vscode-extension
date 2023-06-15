import {
	WebviewView,
	Uri,
	EventEmitter,
	ExtensionContext,
	commands,
	workspace,
	window,
} from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import {
	CodemodTree,
	CodemodTreeNode,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import { CodemodService } from '../../packageJsonAnalyzer/codemodService';
import {
	CodemodElementWithChildren,
	CodemodHash,
} from '../../packageJsonAnalyzer/types';
import { getElementIconBaseName } from '../../utilities';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/These';
import * as TE from 'fp-ts/TaskEither';

import { ElementKind } from '../../elements/types';
import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import type { SyntheticError } from '../../errors/types';
import { pipe } from 'fp-ts/lib/function';
import { WorkspaceState } from '../../persistedState/workspaceState';
import { actions } from '../../data/slice';
import { Store } from '../../data';

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

const repomodHashes = ['QKEdp-pofR9UnglrKAGDm1Oj6W0'];

export class CodemodListPanel {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver;
	__engineBootstrapped = false;
	__codemodTree: CodemodTree = E.right(O.none);
	__autocompleteItems: string[] = [];
	// map between hash and the Tree Node
	__treeMap = new Map<CodemodHash, CodemodTreeNode>();
	__treeNodesByDepth: CodemodTreeNode[][] = [];

	readonly __eventEmitter = new EventEmitter<void>();

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		public readonly __rootPath: string | null,
		public readonly __codemodService: CodemodService,
		private readonly __workspaceState: WorkspaceState,
		private readonly __store: Store,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolver = new WebviewResolver(this.__extensionPath);

		this.__messageBus.subscribe(
			MessageKind.engineBootstrapped,
			async () => {
				this.__engineBootstrapped = true;
				this.getCodemodTree();
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

	public getInitialProps() {
		return {};
	}

	public setView() {
		const state = this.__store.getState();

		this.__postMessage({
			kind: 'webview.codemodList.setView',
			value: {
				viewId: 'codemods',
				viewProps: {
					codemodTree: this.__codemodTree,
					autocompleteItems: this.__autocompleteItems,
					openedIds: Array.from(
						this.__workspaceState.getOpenedCodemodHashDigests(),
					),
					focusedId: state.codemodDiscoveryView
						.focusedCodemodHashDigest as CodemodHash | null,
					nodesByDepth: this.__treeNodesByDepth,
					nodeIds: Array.from(this.__treeMap.values())
						.slice(1) // exclude the root node because we don't display it to users
						.map((node) => node.id),
				},
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

		const oldExecution =
			this.__workspaceState.getExecutionPath(codemodHash);

		const oldExecutionPath = T.isLeft(oldExecution)
			? null
			: oldExecution.right;

		try {
			await workspace.fs.stat(Uri.file(newPath));

			this.__workspaceState.setExecutionPath(
				codemodHash,
				T.right(newPath),
			);

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
				this.__workspaceState.setExecutionPath(
					codemodHash,
					T.right(oldExecutionPath),
				);

				this.__store.dispatch(
					actions.setExecutionPath({
						codemodHash,
						path: oldExecutionPath,
					}),
				);
			} else {
				this.__workspaceState.setExecutionPath(
					codemodHash,
					T.both<SyntheticError, string>(
						{
							kind: 'syntheticError',
							message: `${newPath} does not exist.`,
						},
						oldExecutionPath,
					),
				);

				this.__store.dispatch(
					actions.setExecutionPath({
						codemodHash,
						path: oldExecutionPath,
					}),
				);
			}
		}

		await this.getCodemodTree();
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
			const codemod = this.__codemodService.getCodemodItem(message.value);
			if (!codemod || codemod.kind === 'path') {
				return;
			}

			const { hash } = codemod;

			this.__store.dispatch(actions.setRecentCodemodHashes(hash));
			const executionPath = this.__workspaceState.getExecutionPath(hash);
			if (T.isLeft(executionPath)) {
				return;
			}

			const uri = Uri.file(executionPath.right);

			commands.executeCommand('intuita.executeCodemod', uri, hash);
		}

		if (message.kind === 'webview.codemodList.updatePathToExecute') {
			await this.updateExecutionPath(message.value);
		}

		if (message.kind === 'webview.codemodList.afterWebviewMounted') {
			this.getCodemodTree();
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

		if (message.kind === 'webview.codemods.setState') {
			this.__store.dispatch(
				actions.setFocusedCodemodHashDigest(message.focusedId),
			);

			this.__workspaceState.setOpenedCodemodHashDigests(
				new Set(message.openedIds),
			);

			this.__store.dispatch(
				actions.setOpenedCodemodHashDigests(message.openedIds),
			);
		}
	};

	private async __getCodemodTree(): Promise<CodemodTree> {
		try {
			await this.__codemodService.getDiscoveredCodemods();

			const codemodList = this.__getCodemod();

			if (codemodList.length === 0 && !this.__engineBootstrapped) {
				return E.right(O.none);
			}

			const treeNodes = codemodList.map((codemod) =>
				this.__getTreeNode(codemod, 0, null),
			);

			if (!treeNodes[0]) {
				return E.left({
					kind: 'syntheticError',
					message: 'No codemods were found',
				});
			}

			return E.right(O.some(treeNodes[0]));
		} catch (error) {
			console.error(error);

			const syntheticError: SyntheticError = {
				kind: 'syntheticError',
				message: error instanceof Error ? error.message : String(error),
			};

			return E.left(syntheticError);
		}
	}

	// TODO change to private & separate calculation from sending
	public async getCodemodTree() {
		this.__codemodTree = await this.__getCodemodTree();
		this.setView();
	}

	private __getTreeNode(
		codemodElement: CodemodElementWithChildren,
		depth: number,
		parentId: CodemodHash | null,
	): CodemodTreeNode {
		if (codemodElement.kind === 'codemodItem') {
			const { label, kind, description, hash, name } = codemodElement;

			const executionPath = this.__workspaceState.getExecutionPath(hash);

			const node: CodemodTreeNode = {
				kind,
				label,
				description: description,
				iconName: getElementIconBaseName(ElementKind.CASE, null),
				id: hash,
				actions: [
					{
						title: '✓ Dry Run',
						description:
							'Run this codemod without making change to file system',
						kind: 'webview.codemodList.dryRunCodemod',
						value: hash,
					},
				],
				children: [],
				executionPath,
				modKind: repomodHashes.includes(hash)
					? 'repomod'
					: 'executeCodemod',
				doubleClickCommand: {
					title: 'Show codemod metadata',
					command: 'intuita.showCodemodMetadata',
					arguments: [name],
				},
				uri: name,
				depth,
				parentId,
			};

			this.__treeMap.set(hash, node);

			const nodesAtCurrDepth = this.__treeNodesByDepth[depth] ?? [];
			nodesAtCurrDepth.push(node);
			this.__treeNodesByDepth[depth] = nodesAtCurrDepth;

			return node;
		}

		const { label, kind, hash, children, path } = codemodElement;

		const node: CodemodTreeNode = {
			kind,
			iconName: 'folder.svg',
			label,
			id: hash,
			uri: path,
			actions: [],
			children: [],
			depth,
			parentId,
		};

		this.__treeMap.set(hash, node);

		const nodesAtCurrDepth = this.__treeNodesByDepth[depth] ?? [];
		nodesAtCurrDepth.push(node);
		this.__treeNodesByDepth[depth] = nodesAtCurrDepth;

		// children is set after adding the node to the tree map
		// in order to retain the ordering
		node.children = children.map((child) =>
			this.__getTreeNode(child, depth + 1, node.id),
		);

		return node;
	}

	private __getCodemod(
		codemodHash?: CodemodHash,
	): CodemodElementWithChildren[] {
		const childrenHashes = this.__codemodService.getChildren(codemodHash);
		const children: CodemodElementWithChildren[] = [];
		childrenHashes.forEach((child) => {
			const codemod = this.__codemodService.getCodemodElement(child);
			if (!codemod) {
				return;
			}
			if (codemod.kind === 'codemodItem') {
				children.push(codemod);
				return;
			}

			const childDescendents = this.__getCodemod(child);

			children.push({ ...codemod, children: childDescendents });
		});
		return children;
	}
}
