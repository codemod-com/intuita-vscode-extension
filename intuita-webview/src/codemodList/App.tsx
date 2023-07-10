import areEqual from 'fast-deep-equal';
import { memo } from 'react';

import { vscode } from '../shared/utilities/vscode';
import SearchBar from '../shared/SearchBar';

import TreeView from './TreeView';

import type { MainWebviewViewProps } from '../../../src/selectors/selectMainWebviewViewProps';
import cn from 'classnames';

const setSearchPhrase = (searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setCodemodSearchPhrase',
		searchPhrase,
	});
};

export const App = memo(
	(
		props: MainWebviewViewProps & {
			activeTabId: 'codemods';
			screenWidth: number | null;
		},
	) => (
		<main className={cn('w-full', 'h-full', 'overflow-y-auto')}>
			<SearchBar
				searchPhrase={props.searchPhrase}
				setSearchPhrase={setSearchPhrase}
				placeholder="Search codemods..."
			/>
			<TreeView
				screenWidth={props.screenWidth}
				rootPath={props.rootPath}
				tree={props.codemodTree}
				autocompleteItems={props.autocompleteItems}
			/>
		</main>
	),
	areEqual,
);
