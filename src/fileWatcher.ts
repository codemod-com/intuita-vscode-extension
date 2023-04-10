import { workspace, Disposable } from 'vscode';

export const watchFileWithPattern = (
	path: string,
	callback: () => void,
): Disposable => {
	const watcher = workspace.createFileSystemWatcher(path);

	// watch for changes
	watcher.onDidChange(() => {
		callback();
	});

	// watch for creation
	watcher.onDidCreate(() => {
		callback();
	});

	// watch for deletion
	watcher.onDidDelete(() => {
		callback();
	});

	return {
		dispose: () => {
			watcher.dispose();
		},
	};
};
