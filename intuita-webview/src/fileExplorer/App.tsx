import { useEffect, useState } from 'react';

import TreeView from './TreeView';
import styles from './style.module.css';

import type {
	JobHash,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import SearchBar from '../shared/SearchBar';
import ActionsHeader from './ActionsHeader';
import Progress from '../shared/Progress';

import { vscode } from '../shared/utilities/vscode';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

type Props = { screenWidth: number | null };

function App({ screenWidth }: Props) {
	const [viewProps, setViewProps] = useState(
		window.INITIAL_STATE.fileExplorerProps,
	);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [stagedJobs, setStagedJobs] = useState<ReadonlyArray<JobHash>>([]);

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

	if (viewProps === null || viewProps.caseHash === null) {
		return (
			<p className={styles.welcomeMessage}>
				Choose a Codemod from Codemod Runs to explore its changes!
			</p>
		);
	}

	const { fileNodes, caseHash, openedIds, focusedId, node } = viewProps;

	const TreeOrProgress = pipe(
		node,
		O.fold(
			() => <Progress />,
			(node) => {
				return (
					<TreeView
						{...viewProps}
						caseHash={caseHash}
						node={node}
						searchQuery={searchQuery}
						stagedJobs={stagedJobs.slice()}
						openedIds={new Set(openedIds)}
						focusedNodeId={focusedId}
					/>
				);
			},
		),
	);

	return (
		<main
			className={styles.container}
			style={{ ...(fileNodes === null && { cursor: 'not-allowed' }) }}
		>
			{searchQuery.length === 0 && (
				<ActionsHeader
					selectedJobHashes={stagedJobs}
					jobHashes={fileNodes?.map(({ jobHash }) => jobHash) ?? []}
					caseHash={caseHash}
					screenWidth={screenWidth}
				/>
			)}
			{fileNodes !== null && (
				<SearchBar
					searchPhrase={searchQuery}
					setSearchPhrase={setSearchQuery}
					placeholder="Search files..."
				/>
			)}
			<div className={styles.treeContainer}>{TreeOrProgress}</div>
		</main>
	);
}

export default App;
