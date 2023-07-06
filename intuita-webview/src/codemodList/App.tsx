import areEqual from 'fast-deep-equal';
import { memo } from 'react';

import { vscode } from '../shared/utilities/vscode';
import SearchBar from '../shared/SearchBar';

import TreeView from './TreeView';

import styles from './style.module.css';

import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';

const setSearchPhrase = (searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setCodemodSearchPhrase',
		searchPhrase,
	});
};

export const App = memo(
	(props: MainWebviewViewProps & { activeTabId: 'codemods' }) => (
		<main className={styles.root}>
			<SearchBar
				searchPhrase={props.searchPhrase}
				setSearchPhrase={setSearchPhrase}
				placeholder="Search codemods..."
			/>
			<TreeView
				rootPath={props.rootPath}
				tree={props.codemodTree}
				autocompleteItems={props.autocompleteItems}
			/>
		</main>
	),
	areEqual,
);
