import { useEffect, useState } from 'react';

import { vscode } from '../shared/utilities/vscode';

import TreeView from './TreeView';

import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';


declare global {
	interface Window {
		INITIAL_STATE: {
			repositoryPath: string;
			userId: string;
		};
	}
}

// @TODO 
type MainViews = Extract<View, {viewId: 'treeView'}>;

// @ts-ignore
const getViewComponent = (view: MainViews) => {
	switch (view.viewId) {
		case 'treeView': {
			return <TreeView {...view.viewProps} />;
		}
	}
};

function App() {
	const [view, setView] = useState<MainViews | null>(null);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if(message.value.viewId === 'treeView') {
					setView(message.value);
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);


	if (!view) {
		return null;
	}

	return <main className="App">{getViewComponent(view)}</main>;
}

export default App;
