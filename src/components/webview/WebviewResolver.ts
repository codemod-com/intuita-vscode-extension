import { Webview, Uri } from 'vscode';
import { randomBytes } from 'crypto';
import { getUri } from '../../utilities';
import fs from 'fs';

export class WebviewResolver {
	constructor(private readonly __extensionPath: Uri) {}

	public getWebviewOptions() {
		return {
			enableScripts: true,
			localResourceRoots: [
				Uri.joinPath(this.__extensionPath, 'intuita-webview/build'),
				Uri.joinPath(this.__extensionPath, 'resources'),
			],
			retainContextWhenHidden: true,
		};
	}

	public resolveWebview(
		webview: Webview,
		webviewName: string,
		initialData: string,
	) {
		webview.options = this.getWebviewOptions();
		webview.html = this.__getHtmlForWebview(
			webview,
			webviewName,
			initialData,
		);
	}

	private __getHtmlForWebview(
		webview: Webview,
		webviewName: string,
		initialData: string,
	) {
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

		// TODO: enable importing chunks on demand
		// find files that end with .chunk.js
		const chunkFiles = fs
			.readdirSync(
				Uri.joinPath(
					this.__extensionPath,
					'intuita-webview/build/static/js',
				).fsPath,
			)
			.filter((file) => file.endsWith('.chunk.js'));

		const chunkUris = chunkFiles.map((file) =>
			getUri(webview, this.__extensionPath, [
				'intuita-webview',
				'build',
				'static',
				'js',
				file,
			]),
		);

		const nonce = randomBytes(16).toString('hex');
		const codiconsUri = getUri(webview, this.__extensionPath, [
			'resources',
			'codicon.css',
		]);

		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
					<meta name="theme-color" content="#000000">
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; font-src ${
			webview.cspSource
		}; style-src ${webview.cspSource} 'unsafe-inline'">
					<link href="${codiconsUri}" type="text/css" rel="stylesheet" />
					<link rel="stylesheet" type="text/css" href="${stylesUri}">
					<title>Intuita Panel</title>
					<style>
					 .placeholder {
						text-align: center;
					 }
					</style>
				</head>
				<body>
					<div id="root">
						<h1 class="placeholder">Loading...</h1>
					</div>
					<script nonce="${nonce}">
					window.INITIAL_STATE=${initialData}
					</script>
					<script nonce="${nonce}" src="${scriptUri}"></script>
					${chunkUris
						.map(
							(uri) =>
								`<script async nonce="${nonce}" src="${uri}"></script>`,
						)
						.join('')}
				</body>
			</html>
		`;
	}
}
