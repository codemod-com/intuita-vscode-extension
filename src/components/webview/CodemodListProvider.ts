import {
	WebviewViewProvider,
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
import { ElementKind } from '../../elements/types';
import type { SyntheticError } from '../../errors/types';
import { WorkspaceState } from '../../persistedState/workspaceState';

export class CodemodListPanelProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__engineBootstrapped = false;
	__focusedCodemodHashDigest: CodemodHash | null = null;
	__codemodTree: CodemodTree = E.right(O.none);
	__workspaceState: WorkspaceState;

	readonly __eventEmitter = new EventEmitter<void>();

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		public readonly __rootPath: string | null,
		public readonly __codemodService: CodemodService,
	) {
		this.__extensionPath = context.extensionUri;
		this.__workspaceState = new WorkspaceState(
			context.workspaceState,
			__rootPath ?? '/',
		);
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);

		this.__messageBus.subscribe(MessageKind.engineBootstrapped, () => {
			this.__engineBootstrapped = true;
			this.getCodemodTree();
		});
		this.__messageBus.subscribe(
			MessageKind.showProgress,
			this.handleCodemodExecutionProgress.bind(this),
		);

		this.__messageBus.subscribe(MessageKind.focusCodemod, (message) => {
			this.__focusedCodemodHashDigest = message.codemodHashDigest;

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

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			this.__view.webview,
			'codemodList',
			JSON.stringify({
				focusedCodemodHashDigest: this.__focusedCodemodHashDigest,
			}),
		);
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}

	public setView() {
		this.__postMessage({
			kind: 'webview.global.setView',
			value: {
				viewId: 'codemods',
				viewProps: {
					codemodTree: this.__codemodTree,
				},
			},
		});
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			webviewView.webview,
			'codemodList',
			JSON.stringify({
				focusedCodemodHashDigest: this.__focusedCodemodHashDigest,
			}),
		);
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
			if (message.value.command === 'openLink') {
				commands.executeCommand(
					'vscode.open',
					Uri.parse(message.value.arguments?.[0] ?? ''),
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
			const executionPath = this.__workspaceState.getExecutionPath(hash);
			if (T.isLeft(executionPath)) {
				return;
			}

			const uri = Uri.file(executionPath.right);

			commands.executeCommand('intuita.executeCodemod', uri, hash);
		}

		if (message.kind === 'webview.codemodList.updatePathToExecute') {
			if (this.__rootPath === null) {
				window.showWarningMessage('No active workspace is found.');
				return;
			}
			const { newPath, codemodHash } = message.value;

			try {
				await workspace.fs.stat(Uri.file(newPath));
				this.__workspaceState.setExecutionPath(
					codemodHash,
					T.right(newPath),
				);

				window.showInformationMessage(
					'Updated the codemod execution path.',
				);
			} catch (e) {
				window.showErrorMessage(
					'The specified codemod execution path does not exist.',
				);

				const oldExecutionPath =
					this.__workspaceState.getExecutionPath(codemodHash);
				if (T.isLeft(oldExecutionPath)) {
					return;
				}
				this.__workspaceState.setExecutionPath(
					codemodHash,
					T.both<SyntheticError, string>(
						{
							kind: 'syntheticError',
							message: `${newPath} does not exist.`,
						},
						oldExecutionPath.right,
					),
				);
			}

			await this.getCodemodTree();
		}

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.getCodemodTree();
		}
	};

	private async __getCodemodTree(): Promise<CodemodTree> {
		if (!this.__engineBootstrapped) {
			return E.right(O.none);
		}

		try {
			await this.__codemodService.getDiscoveredCodemods();

			const codemodList = this.__getCodemod();
			const treeNodes = codemodList.map((codemod) =>
				this.__getTreeNode(codemod),
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
	): CodemodTreeNode {
		if (codemodElement.kind === 'codemodItem') {
			const { label, kind, description, hash } = codemodElement;

			const executionPath = this.__workspaceState.getExecutionPath(hash);

			return {
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
				modKind:
					hash === 'QKEdp-pofR9UnglrKAGDm1Oj6W0'
						? 'repomod'
						: 'executeCodemod',
			};
		}

		const { label, kind, hash, children } = codemodElement;
		return {
			kind,
			iconName: 'folder.svg',
			label: label,
			id: hash,
			actions: [],
			children: children.map((child) => this.__getTreeNode(child)),
		};
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
