import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import type { WebviewMessage, View } from '../shared/types';
import TreeView from './TreeView';
import { Container, LoadingContainer } from './components/Container';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import * as E from 'fp-ts/Either';
import './index.css';

type CodemodView = Extract<View, { viewId: 'codemods' }>;

const loadingContainer = (
	<LoadingContainer>
		<VSCodeProgressRing className="progressBar" />
		<span aria-label="loading">Loading ...</span>
	</LoadingContainer>
);

function App() {
	const [view, setView] = useState<CodemodView | null>(null);

	const [pathEditResponse, setPathEditResponse] = useState<
		E.Either<Error, string | null>
	>(E.right(null));

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (
				message.kind === 'webview.global.setView' &&
				message.value.viewId === 'codemods'
			) {
				setView(message.value);
			}

			if (message.kind === 'webview.codemodList.updatePathResponse') {
				setPathEditResponse(message.data);
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

	const { codemods } = view.viewProps;

	return (
		<main className="App">
			<Container
				defaultExpanded
				headerTitle="Public Codemods"
				className="content-border-top h-full"
			>
				<div>
					{E.isRight(codemods) &&
						(codemods.right !== null ? (
							<TreeView
								response={pathEditResponse}
								node={codemods.right}
							/>
						) : (
							loadingContainer
						))}
					{E.isLeft(codemods) && <p>{codemods.left.message}</p>}
				</div>
			</Container>
		</main>
	);
}

export default App;
