import type { StatusBarItem } from 'vscode';

export class StatusBarItemManager {
	#statusBarItem: StatusBarItem;

	constructor(statusBarItem: StatusBarItem) {
		this.#statusBarItem = statusBarItem;
	}

	moveToStandby() {
		this.#statusBarItem.text = '$(pass-filled) Intuita';
		this.#statusBarItem.tooltip = 'The Intuita VSCode Extension is ready';
		this.#statusBarItem.show();
	}

	moveToBootstrap() {
		this.#statusBarItem.text = '$(loading~spin) Intuita: Bootstrapping';
		this.#statusBarItem.tooltip =
			'Bootstrapping the Nora Node Engine and the Nora Rust Engine';
		this.#statusBarItem.show();
	}

	moveToProgress(numberOfProcessedFiles: number, numberOfTotalFiles: number) {
		const percentage = Math.trunc(
			(100 * numberOfProcessedFiles) / numberOfTotalFiles,
		);

		this.#statusBarItem.text = `$(loading~spin) Intuita: ${percentage}%`;
		this.#statusBarItem.tooltip = `Processed ${numberOfProcessedFiles} files out of ${numberOfTotalFiles}.\nClick the status bar item to shutdown the operation.`;
		this.#statusBarItem.show();
	}
}
