import { WebviewView, Uri, commands } from 'vscode';
import { ExternalLink, WebviewResponse } from './webviewEvents';

const EXTERNAL_LINKS: ExternalLink[] = [
	{
		text: 'Feature requests',
		id: 'featureRequest',
		url: 'https://feedback.intuita.io/feature-requests-and-bugs',
	},
	{
		text: 'Codemod requests',
		id: 'codemodRequest',
		url: 'https://feedback.intuita.io/codemod-requests',
	},
	{
		text: 'Docs',
		id: 'docs',
		url: 'https://docs.intuita.io/docs/intro',
	},
	{
		text: 'Youtube channel',
		id: 'youtube',
		url: 'https://www.youtube.com/channel/UCAORbHiie6y5yVaAUL-1nHA',
	},
	{
		text: 'Chat with us on Slack',
		id: 'slack',
		url: 'https://join.slack.com/t/intuita-inc/shared_invite/zt-1untfdpwh-XWuFslRz0D8cGbmjymd3Bw',
	},
];

export class Community {
	__view: WebviewView | null = null;

	setWebview(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__view = webviewView;

		this.__attachWebviewEventListeners();
	}

	public getInitialProps() {
		return {
			externalLinks: EXTERNAL_LINKS,
		};
	}

	private __onDidReceiveMessage = (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			if (message.value.command === 'openLink') {
				commands.executeCommand(
					'vscode.open',
					Uri.parse(message.value.arguments?.[0] ?? ''),
				);
			}
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
