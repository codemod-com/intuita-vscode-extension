import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './style.module.css';

import type {
	JobHash,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import SearchBar from '../shared/SearchBar';
import ActionsHeader from './ActionsHeader';
import Progress from '../shared/Progress';

import { vscode } from '../shared/utilities/vscode';
import { IntuitaTreeView } from '../intuitaTreeView';
import { explorerNodeRenderer } from './explorerNodeRenderer';
import {
	ExplorerNode,
	ExplorerNodeHashDigest,
} from '../../../src/selectors/selectExplorerTree';

export function isNeitherNullNorUndefined<T>(
	value: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): value is T & {} {
	return value !== null && value !== undefined;
}

type Props = { screenWidth: number | null };

const setSearchPhrase = (searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setChangeExplorerSearchPhrase',
		searchPhrase,
	});
};

function App({ screenWidth }: Props) {
	const [viewProps, setViewProps] = useState(
		window.INITIAL_STATE.fileExplorerProps,
	);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (message.kind === 'webview.fileExplorer.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'fileExplorer') {
					setViewProps(message.value.viewProps);
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	const appliedJobHashes = useMemo(
		() => viewProps?.appliedJobHashes ?? [],
		[viewProps],
	);

	const onToggleJob = useCallback(
		(jobHash: JobHash) => {
			const stagedJobsSet = new Set(appliedJobHashes);

			if (stagedJobsSet.has(jobHash)) {
				stagedJobsSet.delete(jobHash);
			} else {
				stagedJobsSet.add(jobHash);
			}

			vscode.postMessage({
				kind: 'webview.global.stageJobs',
				jobHashes: Array.from(stagedJobsSet),
			});
		},
		[appliedJobHashes],
	);

	const onFocus = (hashDigest: ExplorerNodeHashDigest) => {
		if (viewProps === null) {
			return;
		}

		const index = viewProps.nodeData.findIndex(
			(nodeDatum) => nodeDatum.node.hashDigest === hashDigest,
		);

		// find the first FILE node in the tree that is or follows the `index` node
		// this means that if we pick a DIRECTORY, the first FILE under it will be matched

		const slicedNodes = viewProps.nodeData
			.slice(index)
			.map(({ node }) => node);

		const node = slicedNodes.find<ExplorerNode & { kind: 'FILE' }>(
			(node): node is ExplorerNode & { kind: 'FILE' } =>
				node.kind === 'FILE',
		);

		vscode.postMessage({
			kind: 'webview.global.selectExplorerNodeHashDigest',
			selectedExplorerNodeHashDigest: hashDigest,
			caseHash: viewProps.caseHash,
			jobHash: node?.jobHash ?? null,
		});
	};

	const onFlip = (hashDigest: ExplorerNodeHashDigest) => {
		vscode.postMessage({
			kind: 'webview.global.flipChangeExplorerNodeIds',
			hashDigest,
		});

		onFocus(hashDigest);
	};

	if ((viewProps?.caseHash ?? null) === null) {
		return (
			<p className={styles.welcomeMessage}>
				Choose a Codemod from Codemod Runs to explore its changes!
			</p>
		);
	}

	return (
		<main
			className={styles.container}
			style={{ ...(viewProps === null && { cursor: 'not-allowed' }) }}
		>
			{viewProps !== null && (
				<ActionsHeader
					selectedJobHashes={viewProps.appliedJobHashes}
					jobHashes={viewProps.jobHashes}
					caseHash={viewProps.caseHash}
					screenWidth={screenWidth}
				/>
			)}
			{viewProps !== null && (
				<SearchBar
					searchPhrase={viewProps.searchPhrase}
					setSearchPhrase={setSearchPhrase}
					placeholder="Search files..."
				/>
			)}
			<div className={styles.treeContainer}>
				{viewProps !== null ? (
					<IntuitaTreeView<ExplorerNodeHashDigest, ExplorerNode>
						{...viewProps}
						nodeRenderer={explorerNodeRenderer(
							viewProps,
							onToggleJob,
						)}
						onFlip={onFlip}
						onFocus={onFocus}
					/>
				) : (
					<Progress />
				)}
			</div>
		</main>
	);
}

export default App;
