import { Webview, Uri } from 'vscode';
import { randomBytes } from 'crypto';
import { getUri } from '../../utilities';
export class WebviewResolver {
	constructor(private readonly __extensionPath: Uri) {}

	public getWebviewOptions(retainContextWhenHidden?: boolean) {
		return {
			enableScripts: true,
			localResourceRoots: [
				Uri.joinPath(this.__extensionPath, 'intuita-webview/build'),
				Uri.joinPath(this.__extensionPath, 'resources'),
			],
			retainContextWhenHidden: retainContextWhenHidden ?? true,
		};
	}

	public resolveWebview(
		webview: Webview,
		webviewName: string,
		initialData: string,
		retainContextWhenHidden?: boolean,
	) {
		webview.options = this.getWebviewOptions(retainContextWhenHidden);
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
			webviewName,
			'assets',
			`index.css`,
		]);
		const scriptUri = getUri(webview, this.__extensionPath, [
			'intuita-webview',
			'build',
			webviewName,
			'assets',
			`${webviewName}.js`,
		]);

		const nonce = randomBytes(16).toString('hex');
		const codiconsUri = getUri(webview, this.__extensionPath, [
			'resources',
			'codicon.css',
		]);

		const scriptSources = [
			`'nonce-${nonce}'`,
			'https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/',
		];

		const styleSources = [
			webview.cspSource,
			`'self'`,
			`'unsafe-inline'`,
			'https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/',
		];

		const fontSources = [
			webview.cspSource,
			'https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1',
		];

		const imageSources = [
			webview.cspSource,
			`'self'`,
			`data:`,
			`vscode-resource:`,
			`https:`,
		];

		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
					<meta name="theme-color" content="#000000">
					<meta http-equiv="Content-Security-Policy" content="
					default-src 'none';
					script-src ${scriptSources.join(' ')}; 
					font-src ${fontSources.join(' ')};
					style-src ${styleSources.join(' ')};
					worker-src blob:;
					img-src ${imageSources.join(' ')};
					">
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
					<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>
		`;
	}
}
