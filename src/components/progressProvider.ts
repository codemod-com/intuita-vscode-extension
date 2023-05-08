import { WebviewViewProvider, WebviewView } from 'vscode';
import { MessageBus, MessageKind } from './messageBus';

export class CodemodExecutionProgressWebviewViewProvider
	implements WebviewViewProvider
{
	#webviewView: WebviewView | undefined;
	#progress: null | number = null;
	#totalFiles: null | number = null;
	#processedFiles: null | number = null;
	#messageBus: MessageBus;

	constructor(messageBus: MessageBus) {
		this.#messageBus = messageBus;
		this.#messageBus.subscribe(MessageKind.showProgress, (data) => {
			const { processedFiles, totalFiles } = data;

			const progress =
				totalFiles > 0
					? Math.round((processedFiles / totalFiles) * 100)
					: 0;
			this.#progress = progress;
			this.#totalFiles = totalFiles;
			this.#processedFiles = processedFiles;
			this.updateContent();
		});
	}

	resolveWebviewView(webviewView: WebviewView): void {
		this.#webviewView = webviewView;
		this.updateContent();
	}

	private updateContent() {
		if (!this.#webviewView) {
			return;
		}
		// Set the HTML content for the webview
		this.#webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Webview</title>
      </head>
      <body>
      <p>
      ${
			this.#progress === null
				? 'No progress to show.'
				: `Progress: ${this.#progress}% `
		}</p>
        <p>
        ${this.#totalFiles === null ? '' : `Total files: ${this.#totalFiles} `}
        </p>
        <p>
        ${
			this.#processedFiles === null
				? ''
				: `Processed files: ${this.#processedFiles} `
		}</p>

      </body>
      </html>
    `;
	}
}
