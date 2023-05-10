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
import { watchFileWithPattern } from '../../fileWatcher';
import { debounce, getElementIconBaseName } from '../../utilities';
import * as E from 'fp-ts/Either';
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
		const watcher = this.__watchPackageJson();
		this.__messageBus.subscribe(MessageKind.extensionDeactivated, () => {
			watcher?.dispose();
		});
		this.__messageBus.subscribe(MessageKind.engineBootstrapped, () => {
			this.__engineBootstrapped = true;
			this.getCodemodTree('public');
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

	private __watchPackageJson() {
		return watchFileWithPattern(
			'**/package.json',
			debounce(this.getCodemodTree.bind(this), 50),
		);
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

		this.__view.onDidChangeVisibility(() => {
			this.getCodemodTree('recommended');
			this.getCodemodTree('public');
		});

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
			if (
				this.__codemodService
					.getListOfCodemodCommands()
					.includes(message.value.command)
			) {
				const args = message.value.arguments;
				if (!args || !args[0]) {
					throw new Error('Expected args[0] to be a path');
				}
				const path = args[0];
				const parsedPath = Uri.file(path);
				if (parsedPath) {
					commands.executeCommand(message.value.command, parsedPath);
				}

				return;
			}
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
			const codemod = this.__codemodService.getCodemodItem(message.value);
			if (!codemod || codemod.kind === 'path') {
				return;
			}
			const { pathToExecute, hash } = codemod;

			const uri = Uri.file(pathToExecute);

			commands.executeCommand('intuita.executeCodemod', uri, hash);
		}

		if (message.kind === 'webview.codemodList.updatePathToExecute') {
			const { codemodHash, newPath } = message.value;
			const codemodItem =
				this.__codemodService.getCodemodItem(codemodHash);
			const isRecommended =
				this.__codemodService.isRecommended(codemodHash);
			if (!codemodItem) {
				return;
			}
			const path = `${this.__rootPath}${newPath}`;
			try {
				await workspace.fs.stat(Uri.file(path));
				this.__codemodService.updateCodemodItemPath(
					isRecommended ? 'recommended' : 'public',
					codemodHash,
					path,
				);
				this.__postMessage({
					kind: 'webview.codemodList.updatePathResponse',
					data: E.right('Updated path'),
				});
				window.showInformationMessage(
					`Updated path for codemod ${codemodItem.label} `,
				);
				this.getCodemodTree(isRecommended ? 'recommended' : 'public');
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
			this.getCodemodTree('public');
		}
	};

	public async getCodemodTree(type: 'recommended' | 'public') {
		const recommended = type === 'recommended';
		try {
			if (recommended) {
				await this.__codemodService.getCodemods();
			}

			if (!recommended && !this.__engineBootstrapped) {
				return;
			}

			if (!recommended) {
				await this.__codemodService.getDiscoveredCodemods();
			}

			const codemodList = this.__getCodemod(recommended);
			const treeNodes = codemodList.map((codemod) =>
				this.__getTreeNode(codemod),
			);

			this.__postMessage({
				kind: 'webview.codemods.setPublicCodemods',
				data: E.right(treeNodes[0] ?? null),
			});
		} catch (error) {
			console.error(error);

			if (error instanceof Error && recommended) {
				this.__postMessage({
					kind: 'webview.codemods.setPublicCodemods',
					data: E.left(error),
				});
			}
		}
	}

	private __getTreeNode(
		codemodElement: CodemodElementWithChildren,
	): CodemodTreeNode<string> {
		if (!this.__rootPath) {
			throw new Error('Expected rootPath to be defined');
		}
		if (codemodElement.kind === 'codemodItem') {
			const { label, kind, pathToExecute, description, hash } =
				codemodElement;
			return {
				kind,
				label,
				extraData: pathToExecute.replace(this.__rootPath, '') || '/',
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
		recommended: boolean,
		codemodHash?: CodemodHash,
	): CodemodElementWithChildren[] {
		const childrenHashes = this.__codemodService.getChildren(
			recommended,
			codemodHash,
		);
		const children: CodemodElementWithChildren[] = [];
		childrenHashes.forEach((child) => {
			const codemod = this.__codemodService.getCodemodElement(
				recommended,
				child,
			);
			if (!codemod) {
				return;
			}
			if (codemod.kind === 'codemodItem') {
				children.push(codemod);
				return;
			}

			const childDescendents = this.__getCodemod(recommended, child);

			children.push({ ...codemod, children: childDescendents });
		});
		return children;
	}
}
