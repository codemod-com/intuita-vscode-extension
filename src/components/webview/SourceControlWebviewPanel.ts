import {
	ExtensionContext,
	WebviewPanel,
	window,
	ViewColumn,
	Disposable,
} from 'vscode';
import { MessageBus, } from '../messageBus';
import { WebviewResolver, View } from './SourceControlWebviewResolver';


export class IntuitaPanel {
	private __panel: WebviewPanel | null = null;
	private __disposables: Disposable[] = [];
	static __instance: IntuitaPanel | null = null;

	static getInstance(
		context: ExtensionContext,
		messageBus: MessageBus,
	) {
		if (this.__instance) {
			return this.__instance;
		}

		return new IntuitaPanel(
			context,
			messageBus,
		);
	}

	private constructor(
		context: ExtensionContext,
 	  messageBus: MessageBus,
	) {

		const webviewResolver  = new WebviewResolver(context.extensionUri, messageBus);

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

		// @TODO
		webviewResolver.resolveWebview(this.__panel.webview, {});
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
						console.log('HERE')
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

		while (this.__disposables.length) {
			const disposable = this.__disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}
}
