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

const onFocus = (hashDigest: ExplorerNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.selectExplorerNodeHashDigest',
		selectedExplorerNodeHashDigest: hashDigest,
	});
};

const onFlip = (hashDigest: ExplorerNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.flipChangeExplorerNodeIds',
		hashDigest,
	});

	onFocus(hashDigest);
};

type Props = { screenWidth: number | null };

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

	const setSearchPhrase = useCallback((searchPhrase: string) => {
		vscode.postMessage({
			kind: 'webview.global.setChangeExplorerSearchPhrase',
			searchPhrase,
		});
	}, []);

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
