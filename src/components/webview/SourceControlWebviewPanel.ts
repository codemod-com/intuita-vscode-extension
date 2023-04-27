import { commands } from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { View, WebviewResponse } from './webviewEvents';
import { IntuitaWebviewPanel, Options } from './WebviewPanel';

export class SourceControlWebviewPanel extends IntuitaWebviewPanel {
	static instance: SourceControlWebviewPanel | null = null;
	private __view: View | null = null;

	static getInstance(options: Options, messageBus: MessageBus) {
		if (!SourceControlWebviewPanel.instance) {
			SourceControlWebviewPanel.instance = new SourceControlWebviewPanel(
				options,
				messageBus,
			);
		}
		return SourceControlWebviewPanel.instance;
	}

	public override dispose() {
		super.dispose();
		SourceControlWebviewPanel.instance = null;
	}

	public getView(): View | null {
		return this.__view;
	}

	public setView(data: View): void {
		this.__view = data;

		this._panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	_attachExtensionEventListeners() {
		[MessageKind.accountUnlinked, MessageKind.accountLinked].forEach(
			(kind) => {
				this._addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.accountLinked
							? message.account
							: null;

					this._postMessage({
						kind: 'webview.global.setUserAccount',
						value,
					});
				});
			},
		);

		// @TODO remove this hook, remote url will be selected by user in the view
		this._addHook(MessageKind.repositoryPathChanged, (message) => {
			this._postMessage({
				kind: 'webview.global.setRepositoryPath',
				repositoryPath: message.repositoryPath,
			});
		});

		[MessageKind.beforeIssueCreated, MessageKind.afterIssueCreated].forEach(
			(kind) => {
				this._addHook(kind, (message) => {
					const value =
						message.kind === MessageKind.beforeIssueCreated;
					this._postMessage({
						kind: 'webview.createIssue.submittingIssue',
						value,
					});
				});
			},
		);

		[MessageKind.beforePRCreated, MessageKind.afterPRCreated].forEach(
			(kind) => {
				this._addHook(kind, (message) => {
					const value = message.kind === MessageKind.beforePRCreated;
					this._postMessage({
						kind: 'webview.createPR.setPullRequestSubmitting',
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
			commands.executeCommand('intuita.clearState');
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
			commands.executeCommand('intuita.clearState');
		}

		if (message.kind === 'webview.createPR.commitChanges') {
			commands.executeCommand(
				'intuita.sourceControl.commitChanges',
				message.value,
			);
			commands.executeCommand('intuita.clearState');
		}

		if (message.kind === 'webview.global.closeView') {
			this.dispose();
		}
	}

	_attachWebviewEventListeners() {
		this._panel?.webview.onDidReceiveMessage(
			this.__onDidReceiveMessage.bind(this),
		);
	}
}
