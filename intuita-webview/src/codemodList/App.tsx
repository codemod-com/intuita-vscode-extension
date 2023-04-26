import { useEffect, useState } from 'react';
import cn from 'classnames';
import { vscode } from '../shared/utilities/vscode';
import type { View, WebviewMessage, CodemodTreeNode } from '../shared/types';
import TreeView from './TreeView';
import { Container, LoadingContainer } from './components/Container';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';

type MainViews = Extract<View, { viewId: 'codemodList' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);
	const [publicCodemods, setPublicCodemods] =
		useState<CodemodTreeNode<string> | null>(null);
	const [error, setError] = useState<string | null>(null);

	const [publicCodemodsExpanded, setPublicCodemodsExpanded] = useState(true);
	const [recommendedCodemodsExpanded, seRecommendedCodemodsExpanded] =
		useState(true);
	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (
				message.kind === 'webview.global.setView' &&
				message.value.viewId === 'codemodList'
			) {
				setView(message.value);
			}
			if (message.kind === 'webview.codemodlist.setPublicCodemodList') {
				setPublicCodemods(message.value ?? null);
				setError(message.error ?? null);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view) {
		return null;
	}

	return (
		<main className="App">
			<Container
				className={cn('flex-none ', {
					'max-h-full h-full-40':
						!publicCodemodsExpanded && recommendedCodemodsExpanded,
					'max-h-half h-auto': publicCodemodsExpanded,
				})}
				onToggle={(toggled) => seRecommendedCodemodsExpanded(toggled)}
				headerTitle="Recommended Codemods (For This Workspace)"
			>
				<TreeView node={view.viewProps.data} />
			</Container>
			<Container
				onToggle={(toggled) => setPublicCodemodsExpanded(toggled)}
				headerTitle="Public Codemods"
				className=" content-border-top  h-full"
			>
				<div>
					{publicCodemods && <TreeView node={publicCodemods} />}
					{!publicCodemods && (
						<LoadingContainer>
							<VSCodeProgressRing className="progressBar" />
							<span aria-label="loading"> loading ...</span>
						</LoadingContainer>
					)}
					{error && <p>{error}</p>}
				</div>
			</Container>
		</main>
	);
}

export default App;
