import { memo } from 'react';
import { vscode } from '../shared/utilities/vscode';
import TreeView from './TreeView';
import './index.css';
import SearchBar from '../shared/SearchBar';
import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import { TabKind } from '../../../src/persistedState/codecs';

const setSearchPhrase = (searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setCodemodSearchPhrase',
		searchPhrase,
	});
};

export const App = memo(
	(props: MainWebviewViewProps & { activeTabId: TabKind.codemods }) => (
		<main className="App">
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
);
