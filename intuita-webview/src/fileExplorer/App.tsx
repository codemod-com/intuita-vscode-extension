import { useEffect, useState } from 'react';

import TreeView from './TreeView';
import styles from './style.module.css';

import type {
	JobHash,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import SearchBar from '../shared/SearchBar';
import ActionsHeader from './ActionsHeader';
import { vscode } from '../shared/utilities/vscode';


function App() {
	const [viewProps, setViewProps] = useState(
		window.INITIAL_STATE.fileExplorerProps,
	);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [stagedJobs, setStagedJobs] = useState<JobHash[]>([]);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (message.kind === 'webview.fileExplorer.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'fileExplorer') {
					setViewProps(message.value.viewProps);
					if (message.value.viewProps?.fileNodes !== null) {
						setStagedJobs(
							message.value.viewProps?.fileNodes.map(
								(node) => node.jobHash,
							) ?? [],
						);
					}
				}
			}

			if (message.kind === 'webview.fileExplorer.updateStagedJobs') {
				setStagedJobs(message.value);
			}
		};

		window.addEventListener('message', handler);
		vscode.postMessage({
			kind: 'webview.fileExplorer.afterWebviewMounted',
		});

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (viewProps === null) {
		return (
			<p className={styles.welcomeMessage}>
				Choose a Codemod from Codemod Runs to explore its changes!
			</p>
		);
	}

	const { fileNodes, caseHash, openedIds, focusedId } = viewProps;

	return (
		<main
			className="App"
			style={{ ...(fileNodes === null && { cursor: 'not-allowed' }) }}
		>
			{searchQuery.length === 0 && (
				<ActionsHeader
					stagedJobs={stagedJobs}
					fileNodes={fileNodes}
					caseHash={caseHash}
				/>
			)}
			{fileNodes !== null && (
				<SearchBar
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					placeholder="Search files..."
				/>
			)}
			<TreeView
				{...viewProps}
				searchQuery={searchQuery}
				stagedJobs={stagedJobs}
				openedIds={new Set(openedIds)}
				focusedNodeId={focusedId}
			/>
		</main>
	);
}

export default App;
