import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import { WebviewMessage, View } from '../shared/types';
import TreeView from './TreeView';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import './index.css';
import { pipe } from 'fp-ts/lib/function';
import SearchBar from '../shared/SearchBar';

type CodemodView = Extract<View, { viewId: 'codemods' }>;

const loadingContainer = (
	<div className="loadingContainer">
		<VSCodeProgressRing className="progressBar" />
		<span aria-label="loading">Loading...</span>
	</div>
);

function App() {
	const [view, setView] = useState<CodemodView | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');

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
		return <main className="App">{loadingContainer}</main>;
	}

	const {
		codemodTree,
		autocompleteItems,
		openedIds,
		focusedId,
		nodeIds,
		nodesByDepth,
	} = view.viewProps;

	const component = pipe(
		codemodTree,
		E.fold(
			(error) => <p>{error.message}</p>,
			O.fold(
				() => loadingContainer,
				(node) => {
					if (node.children.length === 0) {
						return loadingContainer;
					}

					return (
						<>
							<SearchBar
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								placeholder="Search codemods..."
							/>
							<TreeView
								node={node}
								autocompleteItems={autocompleteItems}
								openedIds={new Set(openedIds)}
								focusedId={focusedId}
								searchQuery={searchQuery}
								nodeIds={nodeIds}
								nodesByDepth={nodesByDepth}
							/>
						</>
					);
				},
			),
		),
	);

	return <main className="App">{component}</main>;
}

export default App;
