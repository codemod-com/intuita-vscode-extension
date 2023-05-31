import { useCallback, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import { WebviewMessage, View } from '../shared/types';
import TreeView from './TreeView';
import { Container } from './components/Container';
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
				message.kind === 'webview.global.setView' &&
				message.value.viewId === 'codemods'
			) {
				setView(message.value);
			}
		};

		window.addEventListener('message', handler);

		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	const setPublicCodemodsExpanded = useCallback(
		(publicCodemodsExpanded: boolean) =>
			vscode.postMessage({
				kind: 'webview.codemods.setPublicCodemodsExpanded',
				publicCodemodsExpanded,
			}),
		[],
	);

	if (view === null) {
		return <main className="App">{loadingContainer}</main>;
	}

	const {
		codemodTree,
		autocompleteItems,
		openedIds,
		focusedId,
		nodeIds,
		publicCodemodsExpanded,
	} = view.viewProps;

	const component = pipe(
		codemodTree,
		E.fold(
			(error) => <p>{error.message}</p>,
			O.fold(
				() => loadingContainer,
				(node) => (
					<TreeView
						node={node}
						autocompleteItems={autocompleteItems}
						openedIds={new Set(openedIds)}
						focusedId={focusedId}
						searchQuery={searchQuery}
						nodeIds={nodeIds}
					/>
				),
			),
		),
	);

	return (
		<main className="App">
			<SearchBar
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				placeholder="Search codemods..."
			/>
			<Container
				headerTitle="Public Codemods"
				className="publicCodemodsContainer content-border-top h-full"
				expanded={publicCodemodsExpanded}
				setExpanded={setPublicCodemodsExpanded}
			>
				<div>{component}</div>
			</Container>
		</main>
	);
}

export default App;
