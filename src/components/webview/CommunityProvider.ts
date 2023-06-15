import { WebviewView, Uri, ExtensionContext, commands } from 'vscode';
import {
	ExternalLink,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';

const EXTERNAL_LINKS: ExternalLink[] = [
	{
		text: 'Feature requests',
		icon: 'featureRequest',
		url: 'https://feedback.intuita.io/feature-requests-and-bugs',
	},
	{
		text: 'Codemod requests',
		icon: 'codemodRequest',
		url: 'https://feedback.intuita.io/codemod-requests',
	},
	{
		text: 'Docs',
		icon: 'docs',
		url: 'https://docs.intuita.io/docs/intro',
	},
	{
		text: 'Youtube channel',
		icon: 'youtube',
		url: 'https://www.youtube.com/channel/UCAORbHiie6y5yVaAUL-1nHA',
	},
	{
		text: 'Chat with us on Slack',
		icon: 'slack',
		url: 'https://join.slack.com/t/intuita-inc/shared_invite/zt-1untfdpwh-XWuFslRz0D8cGbmjymd3Bw',
	},
];

export class Community {
	__view: WebviewView | null = null;
	__webviewResolver: WebviewResolver;

	constructor(context: ExtensionContext) {
		this.__webviewResolver = new WebviewResolver(context.extensionUri);
	}

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

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.community.setView',
			value: data,
		});
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}

	private __onDidReceiveMessage = (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			if (message.value.command === 'openLink') {
				commands.executeCommand(
					'vscode.open',
					Uri.parse(message.value.arguments?.[0] ?? ''),
				);
				return;
			}
		}

		if (message.kind === 'webview.community.afterWebviewMounted') {
			this.setView({
				viewId: 'communityView',
				viewProps: {
					externalLinks: EXTERNAL_LINKS,
				},
			});
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
