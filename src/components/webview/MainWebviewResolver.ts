import {
	Webview,
	Uri,
	Disposable,
} from 'vscode';
import { MessageBus, MessageKind, Message } from '../messageBus';
import { getHTML } from './getHTML';

import { View, WebviewMessage, WebviewResponse } from './webviewEvents';
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

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		const disposable = this.__messageBus.subscribe<T>(kind, handler);
		this.__disposables.push(disposable);
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

  private __getHtmlForWebview(webview: Webview, initialData: any) {
		return getHTML(webview, this.__extensionPath, initialData);
	}

	private __onDidReceiveMessage(message: WebviewResponse) {
    console.log(message)
	}

	private __attachWebviewEventListeners(webview: Webview) {
		webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
