import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
	commands,
} from 'vscode';
import {
	ExternalLink,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';

const EXTERNAL_LINKS: ExternalLink[] = [
	{
		text: 'Youtube channel',
		icon: 'youtube',
		url: 'https://www.youtube.com/channel/UCAORbHiie6y5yVaAUL-1nHA',
	},
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
		text: 'Chat with us on Slack',
		icon: 'slack',
		url: 'https://join.slack.com/t/intuita-inc/shared_invite/zt-1untfdpwh-XWuFslRz0D8cGbmjymd3Bw',
	},
];

export class CommunityProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;

	constructor(context: ExtensionContext) {
		this.__extensionPath = context.extensionUri;
		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			this.__view.webview,
			'communityView',
			'{}',
		);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			webviewView.webview,
			'communityView',
			'{}',
		);
		this.__view = webviewView;

		this.__attachWebviewEventListeners();
	}

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.global.setView',
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

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.setView({
				viewId: 'communityView',
				externalLinks: EXTERNAL_LINKS,
			});
		}
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
