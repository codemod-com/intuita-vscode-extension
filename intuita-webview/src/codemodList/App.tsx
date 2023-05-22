import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import type { WebviewMessage, View } from '../shared/types';
import TreeView from './TreeView';
import { Container, LoadingContainer } from './components/Container';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import './index.css';
import { pipe } from 'fp-ts/lib/function';

type CodemodView = Extract<View, { viewId: 'codemods' }>;

const loadingContainer = (
	<LoadingContainer>
		<VSCodeProgressRing className="progressBar" />
		<span aria-label="loading">Loading ...</span>
	</LoadingContainer>
);

function App() {
	const [view, setView] = useState<CodemodView | null>(null);

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

	if (view === null) {
		return <main className="App">{loadingContainer}</main>;
	}

	const { codemodTree } = view.viewProps;

	const component = pipe(
		codemodTree,
		E.fold(
			(error) => <p>{error.message}</p>,
			O.fold(
				() => loadingContainer,
				(node) => <TreeView node={node} />,
			),
		),
	);

	return (
		<main className="App">
			<Container
				defaultExpanded
				headerTitle="Public Codemods"
				className="content-border-top h-full"
			>
				<div>{component}</div>
			</Container>
		</main>
	);
}

export default App;
