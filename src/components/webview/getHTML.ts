import { randomBytes } from "crypto";
import { Uri, Webview } from "vscode";
import { getUri } from "../../utilities";

export const getHTML  = (webview: Webview, extensionPath: Uri, initialData: object) => {
  const stylesUri = getUri(webview, extensionPath, [
    'intuita-webview',
    'build',
    'static',
    'css',
    'main.css',
  ]);
  const scriptUri = getUri(webview, extensionPath, [
    'intuita-webview',
    'build',
    'static',
    'js',
    'main.js',
  ]);

  // const codiconsUri = getUri(webview, this.__extensionPath, ['node_modules', '@vscode/codicons', 'dist', 'codicon.css']);

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