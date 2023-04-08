import {
	Webview,
	Uri,
} from 'vscode';

import { randomBytes } from 'crypto';
import { getUri } from '../../utilities';

export class WebviewResolver {

	constructor(
		private readonly __extensionPath: Uri,
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
  
	public resolveWebview(webview: Webview,  webviewName: string, initialData: any) {
		webview.options = this.getWebviewOptions();
		webview.html = this.__getHtmlForWebview(webview, webviewName, initialData);
	}

  private __getHtmlForWebview(webview: Webview, webviewName: string,  initialData: any) {
		const stylesUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			'static',
			'css',
			`${webviewName}.css`,
		]);
		const scriptUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			'static',
			'js',
			`${webviewName}.js`,
		]);
	
		const nonce = randomBytes(48).toString('hex');
	
		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
					<meta name="theme-color" content="#000000">
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
				webview.cspSource
			}; script-src 'nonce-${nonce}';">
					<link rel="stylesheet" type="text/css" href="${stylesUri}">
					<title>Intuita Panel</title>
				</head>
				<body>
					<noscript>You need to enable JavaScript to run this app.</noscript>
					<div id="root"></div>
					<script nonce="${nonce}">
					window.INITIAL_STATE=${JSON.stringify(initialData)}
					</script>
					<script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>
		`;
	}
}
