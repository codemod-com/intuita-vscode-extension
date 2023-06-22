import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import { WebviewMessage, View } from '../shared/types';
import TreeView from './TreeView';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import './index.css';
import { pipe } from 'fp-ts/lib/function';
import SearchBar from '../shared/SearchBar';
import Progress from '../shared/Progress';

type CodemodView = Extract<View, { viewId: 'codemods' }>;

type Props = { screenWidth: number | null };

function App({ screenWidth }: Props) {
	const [view, setView] = useState<CodemodView | null>(null);
	const [searchPhrase, setSearchPhrase] = useState<string>('');

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
				() => <Progress />,
				(node) => {
					if (node.children.length === 0) {
						return <Progress />;
					}

					return (
						<>
							<SearchBar
								searchPhrase={searchPhrase}
								setSearchPhrase={setSearchPhrase}
								placeholder="Search codemods..."
							/>
							<TreeView
								screenWidth={screenWidth}
								node={node}
								autocompleteItems={autocompleteItems}
								openedIds={new Set(openedIds)}
								focusedId={focusedId}
								searchQuery={searchPhrase}
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
