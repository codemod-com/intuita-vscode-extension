import { useEffect, useState } from 'react';

import TreeView from './TreeView';
import styles from './style.module.css';

import type {
	JobHash,
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import SearchBar from './SearchBar';

type MainViews = Extract<View, { viewId: 'treeView' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);
	const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [stagedJobs, setStagedJobs] = useState<JobHash[]>([]);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'treeView') {
					setView(message.value);
				}
			}

			if (
				message.kind === 'webview.fileExplorer.focusFile' &&
				message.id !== null
			) {
				setFocusedNodeId(message.id);
			}

			if (message.kind === 'webview.fileExplorer.updateStagedJobs') {
				setStagedJobs(message.value);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view || view.viewProps === null) {
		return (
			<p className={styles.welcomeMessage}>
				Choose a Codemod from Codemod Runs to explore its changes!
			</p>
		);
	}

	return (
		<main className="App">
			<SearchBar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>
			<TreeView
				{...view.viewProps}
				searchQuery={searchQuery}
				focusedNodeId={focusedNodeId}
				setFocusedNodeId={setFocusedNodeId}
				stagedJobs={stagedJobs}
			/>
		</main>
	);
}

export default App;
