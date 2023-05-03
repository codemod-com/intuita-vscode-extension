import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import type { WebviewMessage, CodemodTreeNode } from '../shared/types';
import TreeView from './TreeView';
import { Container, LoadingContainer } from './components/Container';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import * as E from 'fp-ts/Either';
import './index.css';

function App() {
	const [publicCodemods, setPublicCodemods] = useState<
		E.Either<Error, CodemodTreeNode<string> | null>
	>(E.right(null));

	const [pathEditResponse, setPathEditResponse] = useState<
		E.Either<Error, string | null>
	>(E.right(null));

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.codemods.setPublicCodemods') {
				setPublicCodemods(message.data);
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

	return (
		<main className="App">
			<Container
				defaultExpanded
				headerTitle="Public Codemods"
				className="content-border-top  h-full"
			>
				<div>
					{E.isRight(publicCodemods) &&
						publicCodemods.right !== null && (
							<TreeView
								response={pathEditResponse}
								node={publicCodemods.right}
							/>
						)}
					{E.isRight(publicCodemods) &&
						publicCodemods.right === null && (
							<LoadingContainer>
								<VSCodeProgressRing className="progressBar" />
								<span aria-label="loading">Loading ...</span>
							</LoadingContainer>
						)}
					{E.isLeft(publicCodemods) && (
						<p>{publicCodemods.left.message}</p>
					)}
				</div>
			</Container>
		</main>
	);
}

export default App;
