import { WebviewView, workspace } from 'vscode';
import areEqual from 'fast-deep-equal';
import { View, WebviewMessage } from './webviewEvents';
import { Store } from '../../data';
import { selectExplorerTree } from '../../selectors/selectExplorerTree';

type ViewProps = Extract<View, { viewId: 'fileExplorer' }>['viewProps'];

export class FileExplorer {
	__view: WebviewView | null = null;

	constructor(private readonly __store: Store) {
		let prevProps = this.__buildViewProps();

		this.__store.subscribe(() => {
			const nextProps = this.__buildViewProps();

			if (areEqual(prevProps, nextProps)) {
				return;
			}

			prevProps = nextProps;

			this.__postMessage({
				kind: 'webview.fileExplorer.setView',
				value: {
					viewId: 'fileExplorer',
					viewProps: nextProps,
				},
			});
		});
	}

	public getInitialProps(): ViewProps {
		return this.__buildViewProps();
	}

	public setWebview(webviewView: WebviewView): void | Thenable<void> {
		this.__view = webviewView;
	}

	private __buildViewProps(): ViewProps {
		const state = this.__store.getState();

		const fileTree = selectExplorerTree(
			state,
			workspace.workspaceFolders?.[0]?.uri ?? null,
		);

		return fileTree;
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
	}
}
