import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	EventEmitter,
	ExtensionContext,
	commands,
} from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import {
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
import { watchFileWithPattern } from '../../fileWatcher';
import { debounce } from '../../utilities';

export class CodemodListPanelProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__engineBootstrapped = false;
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
		this.__messageBus.subscribe(MessageKind.enginesBootstrapped, () => {
			this.__engineBootstrapped = true;
			this.getCodemodTree('public');
		});
	}

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
			'{}',
		);
	}

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}
	private __postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.webview.postMessage(message);
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
			'{}',
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
	private __onDidReceiveMessage = (message: WebviewResponse) => {
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

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.getCodemodTree('recommended');
			this.getCodemodTree('public');
		}
	};

	public async getCodemodTree(type: 'recommended' | 'public') {
		const recommended = type === 'recommended';
		try {
			if (recommended) {
				await this.__codemodService.getCodemods();
			} else {
				if (!this.__engineBootstrapped) {
					return;
				}
				await this.__codemodService.getDiscoverdCodemods();
			}
			const codemodList = this.__getCodemod(recommended);
			const treeNodes = codemodList.map((codemod) =>
				this.__getTreeNode(codemod),
			);

			if (recommended) {
				return this.setView({
					viewId: 'codemodList',
					viewProps: {
						data: treeNodes?.[0],
					},
				});
			}
			this.__postMessage({
				kind: 'webview.codemods.setPublicCodemods',
				value: treeNodes?.[0],
			});
		} catch (e) {
			console.error(e);
			if (recommended) {
				this.__postMessage({
					kind: 'webview.codemods.setPublicCodemods',
					value: undefined,
					error: 'Failed to load public codemods',
				});
			}
		}
	}

	private __getTreeNode(
		codemodElement: CodemodElementWithChildren,
	): CodemodTreeNode<string> {
		if (codemodElement.kind === 'codemodItem') {
			const {
				label,
				kind,
				pathToExecute,
				description,
				hash,
				commandToExecute,
			} = codemodElement;
			return {
				kind,
				label,
				extraData: pathToExecute,
				description: description,
				iconName: 'bluelightbulb.svg',
				id: hash,
				actions: [
					{
						title: '✓ Dry Run',
						command: commandToExecute,
						arguments: [pathToExecute],
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
