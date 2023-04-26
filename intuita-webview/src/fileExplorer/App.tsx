import { useEffect, useState } from 'react';

import { vscode } from '../shared/utilities/vscode';

import TreeView from './TreeView';
import styles from './style.module.css';

import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import SearchBar from './SearchBar';

type MainViews = Extract<View, { viewId: 'treeView' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'treeView') {
					setView(message.value);
				}
				if (
					message.value.viewId === 'campaignManagerView' &&
					message.value.viewProps.node === null
				) {
					setView(null);
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);
	console.log(view);
	if (!view) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via VS Code Command &
				check back later!
			</p>
		);
	}

	return (
		<main className="App">
			<SearchBar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>
			<TreeView {...view.viewProps} searchQuery={searchQuery} />
		</main>
	);
}

export default App;
