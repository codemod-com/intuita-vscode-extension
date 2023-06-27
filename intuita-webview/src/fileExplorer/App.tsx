import { useCallback, useEffect, useState } from 'react';
import styles from './style.module.css';
import type { WebviewMessage } from '../../../src/components/webview/webviewEvents';
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

type Props = { screenWidth: number | null };

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

	const caseHash = viewProps?.caseHash ?? null;

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

	if (caseHash === null) {
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
				<SearchBar
					searchPhrase={viewProps.searchPhrase}
					setSearchPhrase={(searchPhrase) =>
						setSearchPhrase(viewProps.caseHash, searchPhrase)
					}
					placeholder="Search files..."
				/>
			)}
			<div className={styles.treeContainer}>
				{viewProps !== null ? (
					<IntuitaTreeView<_ExplorerNodeHashDigest, _ExplorerNode>
						{...viewProps}
						nodeRenderer={explorerNodeRenderer(viewProps)}
						onFlip={handleFlip}
						onFocus={handleFocus}
					/>
				) : (
					<Progress />
				)}
			</div>
			{viewProps !== null && (
				<ActionsFooter
					caseHash={viewProps.caseHash}
					screenWidth={screenWidth}
					searchPhrase={viewProps.searchPhrase}
					selectedJobCount={viewProps.selectedJobCount}
				/>
			)}
		</main>
	);
}

export default App;
