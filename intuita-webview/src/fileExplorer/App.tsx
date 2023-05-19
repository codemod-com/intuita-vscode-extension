import { useEffect, useState } from 'react';

import TreeView from './TreeView';
import styles from './style.module.css';

import type {
	JobHash,
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import SearchBar from './SearchBar';
import ActionsHeader from './ActionsHeader';
import { vscode } from '../shared/utilities/vscode';

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
					setStagedJobs(
						message.value.viewProps?.fileNodes.map(
							(node) => node.jobHash,
						) ?? [],
					);
				}
			}

			if (
				message.kind === 'webview.fileExplorer.focusNode' &&
				message.id !== null
			) {
				setFocusedNodeId(message.id);
			}

			if (message.kind === 'webview.fileExplorer.updateStagedJobs') {
				setStagedJobs(message.value);
			}
		};

		window.addEventListener('message', handler);
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	useEffect(() => {
		if (searchQuery.length > 0) {
			setFocusedNodeId(null);
		}
	}, [searchQuery]);

	if (!view || view.viewProps === null) {
		return (
			<p className={styles.welcomeMessage}>
				Choose a Codemod from Codemod Runs to explore its changes!
			</p>
		);
	}

	const { fileNodes, caseHash } = view.viewProps;

	return (
		<main className="App">
			{searchQuery.length === 0 && (
				<ActionsHeader
					stagedJobs={stagedJobs}
					fileNodes={fileNodes}
					caseHash={caseHash}
				/>
			)}
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
