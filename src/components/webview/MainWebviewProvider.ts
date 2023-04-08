import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
} from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { View, WebviewMessage, WebviewResponse } from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import { Element } from '../../elements/types';

type TreeNode = {
	id: string;
	label: string;
	children?: TreeNode[];
};

const mapMessageToTreeNode = (message: Element): TreeNode => {
	const mappedNode = {
		id: message.hash,
		label: 'label' in message ? message.label : 'Recipe',
		type: message.kind,
		children:
			'children' in message
				? message.children.map(mapMessageToTreeNode)
				: [],
	};

	return mappedNode;
};

export class IntuitaProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolver  = new WebviewResolver(this.__extensionPath);
		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolver?.resolveWebview(this.__view.webview, 'main', {});
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if(!webviewView.webview) return;

		this.__webviewResolver?.resolveWebview(webviewView.webview, 'main', {});
		this.__view = webviewView;
		this.__view.onDidChangeVisibility(() => {
			this.__messageBus.publish({ kind: MessageKind.updateElements });
		})
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

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		this.__messageBus.subscribe<T>(kind, handler);
	}

	private __attachExtensionEventListeners() {
		this.__addHook(MessageKind.afterElementsUpdated, (message) => {
			this.setView({
				viewId: 'treeView',
				viewProps: {
					node: mapMessageToTreeNode(message.element),
				},
			});
		});
	}

	private __onDidReceiveMessage(message: WebviewResponse) {
		console.log(message)
	}

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
