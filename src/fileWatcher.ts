import { workspace, Disposable } from 'vscode';

export const watchFile = (
	filePath: string,
	callback: () => void,
): Disposable => {
	const watcher = workspace.createFileSystemWatcher(filePath);

	const disposable = watcher.onDidChange(() => {
		callback();
	});

	return {
		dispose: () => {
			disposable.dispose();
			watcher.dispose();
		},
	};
};
