import {
	ExtensionContext,
	WebviewPanel,
	window,
	ViewColumn,
	Disposable,
	commands,
	Webview,
} from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { WebviewResolver } from './WebviewResolver';
import { View, WebviewMessage, WebviewResponse } from './webviewEvents';
import { RepositoryService } from './repository';
import { UserAccountStorage } from '../user/userService';

export class IntuitaPanel {
	private __view: Webview | null = null;
	private __panel: WebviewPanel | null = null;
	private __disposables: Disposable[] = [];
	static __instance: IntuitaPanel | null = null;

	static getInstance(
		context: ExtensionContext,
		messageBus: MessageBus,
		repositoryService: RepositoryService,
		userAccountStorage: UserAccountStorage,
	) {
		if (this.__instance) {
			return this.__instance;
		}

		return new IntuitaPanel(
			context,
			messageBus,
			repositoryService,
			userAccountStorage,
		);
	}

	private constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __repositoryService: RepositoryService,
		private readonly __userAccountStorage: UserAccountStorage,
	) {
		const webviewResolver = new WebviewResolver(context.extensionUri);

		this.__panel = window.createWebviewPanel(
			'intuitaPanel',
			'Intuita Panel',
			ViewColumn.One,
			{
				...webviewResolver.getWebviewOptions(),
				// this setting is needed to be able to communicate to webview panel when its not active (when we are on different tab)
				retainContextWhenHidden: true,
			},
		);

		this.__panel.onDidDispose(
			() => this.dispose(),
			null,
			this.__disposables,
		);

		webviewResolver.resolveWebview(
			this.__panel.webview,
			'sourceControl',
			JSON.stringify(this.__prepareWebviewInitialData()),
		);
		this.__view = this.__panel.webview;

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public render() {
		const initWebviewPromise = new Promise((resolve, reject) => {
			this.__panel?.reveal();

			const timeout = setTimeout(() => {
				this.__panel?.dispose();
				reject('Timeout');
			}, 5000);

			const disposable = this.__panel?.webview.onDidReceiveMessage(
				(message) => {
					if (message.kind === 'webview.global.afterWebviewMounted') {
						disposable?.dispose();
						clearTimeout(timeout);
						resolve('Resolved');
					}
				},
			);
		});

		return initWebviewPromise;
	}

	public setView(data: View) {
		this.__panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	public dispose() {
		if (!this.__panel) {
			return;
		}
		this.__panel.dispose();

		this.__disposables.forEach((disposable) => {
			disposable.dispose();
		});

		this.__disposables = [];
	}

	private __prepareWebviewInitialData = (): Readonly<{
		repositoryPath: string | null;
		userId: string | null;
	}> => {
		const repositoryPath = this.__repositoryService.getRepositoryPath();
		const userId = this.__userAccountStorage.getUserAccount();

		return {
			repositoryPath,
			userId,
		};
	};

	private __postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.postMessage(message);
	}

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
	}

	private __attachExtensionEventListeners() {
		[MessageKind.accountUnlinked, MessageKind.accountLinked].forEach(
			(kind) => {
				this.__addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.accountLinked
							? message.account
							: null;

					this.__postMessage({
						kind: 'webview.global.setUserAccount',
						value,
					});
				});
			},
		);

		this.__addHook(MessageKind.repositoryPathChanged, (message) => {
			this.__postMessage({
				kind: 'webview.global.setRepositoryPath',
				repositoryPath: message.repositoryPath,
			});
		});

		[MessageKind.beforeIssueCreated, MessageKind.afterIssueCreated].forEach(
			(kind) => {
				this.__addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.beforeIssueCreated;
					this.__postMessage({
						kind: 'webview.createIssue.setLoading',
						value,
					});
				});
			},
		);
	}

	private __onDidReceiveMessage(message: WebviewResponse) {
		if (message.kind === 'webview.createIssue.submitIssue') {
			commands.executeCommand(
				'intuita.sourceControl.submitIssue',
				message.value,
			);
		}

		if (message.kind === 'webview.global.redirectToSignIn') {
			commands.executeCommand(
				'intuita.redirect',
				'https://codemod.studio/auth/sign-in',
			);
		}

		if (message.kind === 'webview.global.openConfiguration') {
			commands.executeCommand(
				'workbench.action.openSettings',
				'@ext:Intuita.intuita-vscode-extension',
			);
		}

		if (message.kind === 'webview.createPR.submitPR') {
			commands.executeCommand(
				'intuita.sourceControl.createPR',
				message.value,
			);
		}
	}

	private __attachWebviewEventListeners() {
		this.__view?.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
