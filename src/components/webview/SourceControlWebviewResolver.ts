import {
	Webview,
	Uri,
	commands,
	Disposable,
} from 'vscode';
import { MessageBus, MessageKind, Message } from '../messageBus';
import { getHTML } from './getHTML';

import { View, WebviewMessage, WebviewResponse } from './webviewEvents';

export class WebviewResolver {
	private __view: Webview | null = null;
	private __disposables: Disposable[] = [];

	constructor(
		private readonly __extensionPath: Uri,
		private readonly __messageBus: MessageBus, 
	) {
	}

	public getWebviewOptions() {
		return {
			enableScripts: true,
			localResourceRoots: [
				Uri.joinPath(this.__extensionPath, 'intuita-webview/build'),
			],
		}
	}
  
	public resolveWebview(webview: Webview, initialData: any) {
		webview.options = this.getWebviewOptions();
		webview.html = this.__getHtmlForWebview(webview, initialData);
		
		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners(webview);
	}

	public setView(data: View) {
		this.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	private postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.postMessage(message);
	}

	public dispose() {
		while (this.__disposables.length) {
			const disposable = this.__disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	private addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
	}

	private __attachExtensionEventListeners() {
		[MessageKind.accountUnlinked, MessageKind.accountLinked].forEach(
			(kind) => {
				this.addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.accountLinked
							? message.account
							: null;

					this.postMessage({
						kind: 'webview.global.setUserAccount',
						value,
					});
				});
			},
		);

		this.addHook(MessageKind.configurationChanged, (message) => {
			this.postMessage({
				kind: 'webview.global.setConfiguration',
				value: {
					repositoryPath:
						message.nextConfiguration.repositoryPath ?? null,
				},
			});
		});

		[MessageKind.beforeIssueCreated, MessageKind.afterIssueCreated].forEach(
			(kind) => {
				this.addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.beforeIssueCreated;
					this.postMessage({
						kind: 'webview.createIssue.setLoading',
						value,
					});
				});
			},
		);
	}

  private __getHtmlForWebview(webview: Webview, initialData: any) {
		return getHTML(webview, this.__extensionPath, initialData);
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

	private __attachWebviewEventListeners(webview: Webview) {
		webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
