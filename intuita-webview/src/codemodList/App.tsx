import { memo, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import { WebviewMessage } from '../shared/types';
import TreeView from './TreeView';
import './index.css';
import SearchBar from '../shared/SearchBar';
import Progress from '../shared/Progress';

const setSearchPhrase = (searchPhrase: string) => {
	vscode.postMessage({
		kind: 'webview.global.setCodemodSearchPhrase',
		searchPhrase,
	});
};

function App() {
	const [view, setView] = useState({
		viewProps: window.INITIAL_STATE.codemodListProps,
		viewId: 'codemods',
	});

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (
				message.kind === 'webview.codemodList.setView' &&
				message.value.viewId === 'codemods'
			) {
				setView(message.value);
			}
		};

		window.addEventListener('message', handler);

		vscode.postMessage({ kind: 'webview.codemodList.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (view === null) {
		return (
			<main className="App">
				<Progress />
			</main>
		);
	}

	const { codemodTree, autocompleteItems, searchPhrase, rootPath } =
		view.viewProps;

	return (
		<main className="App">
			<SearchBar
				searchPhrase={searchPhrase}
				setSearchPhrase={setSearchPhrase}
				placeholder="Search codemods..."
			/>
			<TreeView
				rootPath={rootPath}
				tree={codemodTree}
				autocompleteItems={autocompleteItems}
			/>
		</main>
	);
}

export default memo(App);
