import { workspace, Disposable, Uri } from 'vscode';

export const watchFiles = (
	filePath: Uri[],
	callback: () => void,
): Disposable => {
	const watchers = filePath.map((el) =>
		workspace.createFileSystemWatcher(el.fsPath.toString()),
	);

	// watch for changes
	watchers.forEach((watcher) =>
		watcher.onDidChange(() => {
			callback();
		}),
	);

	// watch for creation
	watchers.forEach((watcher) =>
		watcher.onDidCreate(() => {
			callback();
		}),
	);

	// watch for deletion
	watchers.forEach((watcher) =>
		watcher.onDidDelete(() => {
			callback();
		}),
	);

	return {
		dispose: () => {
			watchers.forEach((el) => el.dispose());
		},
	};
};
