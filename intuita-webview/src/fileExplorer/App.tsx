import { useCallback } from 'react';
import styles from './style.module.css';
import SearchBar from '../shared/SearchBar';
import { ActionsFooter } from './ActionsFooter';
import Progress from '../shared/Progress';

import { vscode } from '../shared/utilities/vscode';
import { IntuitaTreeView } from '../intuitaTreeView';
import { explorerNodeRenderer } from './explorerNodeRenderer';
import {
	_ExplorerNode,
	_ExplorerNodeHashDigest,
} from '../../../src/persistedState/explorerNodeCodec';
import { CaseHash } from '../../../src/cases/types';
import { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import LoadingProgress from '../jobDiffView/Components/LoadingProgress';
import { useProgressBar } from '../codemodList/useProgressBar';

const setSearchPhrase = (caseHashDigest: CaseHash, searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setChangeExplorerSearchPhrase',
		caseHashDigest,
		searchPhrase,
	});
};

const onFocus = (
	caseHashDigest: CaseHash,
	explorerNodeHashDigest: _ExplorerNodeHashDigest,
) => {
	vscode.postMessage({
		kind: 'webview.global.focusExplorerNode',
		caseHashDigest,
		explorerNodeHashDigest,
	});
};

const onCollapsibleExplorerNodeFlip = (
	caseHashDigest: CaseHash,
	explorerNodeHashDigest: _ExplorerNodeHashDigest,
) => {
	vscode.postMessage({
		kind: 'webview.global.flipCollapsibleExplorerNode',
		caseHashDigest,
		explorerNodeHashDigest,
	});

	onFocus(caseHashDigest, explorerNodeHashDigest);
};

export const App = (
	props: { screenWidth: number | null } & MainWebviewViewProps & {
			activeTabId: 'codemodRuns';
		},
) => {
	const { changeExplorerTree, codemodExecutionInProgress } = props;
	const progress = useProgressBar();
	const caseHash = changeExplorerTree?.caseHash ?? null;

	const handleFocus = useCallback(
		(hashDigest: _ExplorerNodeHashDigest) => {
			if (caseHash === null) {
				return;
			}

			onFocus(caseHash, hashDigest);
		},

		[caseHash],
	);

	const handleFlip = useCallback(
		(hashDigest: _ExplorerNodeHashDigest) => {
			if (caseHash === null) {
				return;
			}

			onCollapsibleExplorerNodeFlip(caseHash, hashDigest);
		},
		[caseHash],
	);

	if ((props.changeExplorerTree?.caseHash ?? null) === null) {
		return codemodExecutionInProgress ? (
			<LoadingProgress
				description={
					progress === null
						? 'Processing files...'
						: `Processed ${progress.processedFileNumber} / ${progress.totalFileNumber}`
				}
			/>
		) : (
			<p className={styles.welcomeMessage}>
				Choose a Codemod from Codemod Runs to explore its changes!
			</p>
		);
	}

	return (
		<main
			className={styles.container}
			style={{
				...(changeExplorerTree === null && { cursor: 'not-allowed' }),
			}}
		>
			{changeExplorerTree !== null && (
				<SearchBar
					searchPhrase={changeExplorerTree.searchPhrase}
					setSearchPhrase={(searchPhrase) =>
						setSearchPhrase(
							changeExplorerTree.caseHash,
							searchPhrase,
						)
					}
					placeholder="Search by file name"
				/>
			)}
			<div className={styles.treeContainer}>
				{changeExplorerTree !== null ? (
					<IntuitaTreeView<_ExplorerNodeHashDigest, _ExplorerNode>
						{...changeExplorerTree}
						nodeRenderer={explorerNodeRenderer(changeExplorerTree)}
						onFlip={handleFlip}
						onFocus={handleFocus}
					/>
				) : (
					<Progress />
				)}
			</div>
			{changeExplorerTree !== null && (
				<ActionsFooter
					caseHash={changeExplorerTree.caseHash}
					screenWidth={props.screenWidth}
					selectedJobCount={changeExplorerTree.selectedJobCount}
					applySelectedInProgress={props.applySelectedInProgress}
				/>
			)}
		</main>
	);
};
