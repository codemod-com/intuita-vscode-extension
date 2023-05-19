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
	View,
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
import { ElementKind } from '../../elements/types';

export class CodemodListPanelProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__engineBootstrapped = false;
	__focusedCodemodHashDigest: CodemodHash | null = null;

	readonly __eventEmitter = new EventEmitter<void>();

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		public readonly __rootPath: string | null,
		public readonly __codemodService: CodemodService,
	) {
		this.__extensionPath = context.extensionUri;
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

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.global.setView',
			value: data,
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
			const { pathToExecute, hash } = codemod;

			const uri = Uri.file(pathToExecute);

			commands.executeCommand('intuita.executeCodemod', uri, hash);
		}

		if (message.kind === 'webview.codemodList.updatePathToExecute') {
			if (this.__rootPath === null) {
				window.showWarningMessage('No active workspace is found.');
				return;
			}
			const { codemodHash, newPath } = message.value;
			const codemodItem =
				this.__codemodService.getCodemodItem(codemodHash);

			if (!codemodItem) {
				return;
			}
			const path = `${this.__rootPath}${newPath}`;
			try {
				await workspace.fs.stat(Uri.file(path));
				this.__codemodService.updateCodemodItemPath(codemodHash, path);
				this.__postMessage({
					kind: 'webview.codemodList.updatePathResponse',
					data: E.right('Updated path'),
				});
				window.showInformationMessage(
					`Updated path for codemod ${codemodItem.label} `,
				);
				this.getCodemodTree();
			} catch (err) {
				// for better error message , we reconstruct the error
				const reConstructedError = new Error(
					'Path specified does not exist',
				);
				const stringified = JSON.stringify(reConstructedError, [
					'message',
				]);
				this.__postMessage({
					kind: 'webview.codemodList.updatePathResponse',
					data: E.left(JSON.parse(stringified)),
				});
			}
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
				return E.left(new Error('No codemods were found'));
			}

			return E.right(O.some(treeNodes[0]));
		} catch (error) {
			console.error(error);

			const e = error instanceof Error ? error : new Error(String(error));

			return E.left(e);
		}
	}

	// TODO change to private & separate calculation from sending
	public async getCodemodTree() {
		const codemods = await this.__getCodemodTree();
		this.setView({
			viewId: 'codemods',
			viewProps: {
				codemodTree: codemods,
			},
		});
	}

	private __getTreeNode(
		codemodElement: CodemodElementWithChildren,
	): CodemodTreeNode<string> {
		const rootPath = this.__rootPath ?? '';
		if (codemodElement.kind === 'codemodItem') {
			const { label, kind, pathToExecute, description, hash } =
				codemodElement;
			return {
				kind,
				label,
				extraData: pathToExecute.replace(rootPath, '') || '/',
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
