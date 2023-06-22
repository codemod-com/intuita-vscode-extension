import { WebviewView, Uri, commands } from 'vscode';
import { WebviewResponse } from './webviewEvents';

export class Community {
	setWebview(webviewView: WebviewView): void | Thenable<void> {
		webviewView.webview.onDidReceiveMessage((message: WebviewResponse) => {
			if (message.kind === 'webview.command') {
				if (message.value.command === 'openLink') {
					commands.executeCommand(
						'vscode.open',
						Uri.parse(message.value.arguments?.[0] ?? ''),
					);
				}
			}
		});
	}
}
