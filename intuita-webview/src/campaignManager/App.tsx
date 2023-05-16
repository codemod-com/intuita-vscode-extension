import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import ListView from './ListView';
import styles from './style.module.css';
import '../shared/util.css';
import type {
	CaseTreeNode,
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';

type MainViews = Extract<View, { viewId: 'campaignManagerView' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);
	const [selectedCaseNode, setSelectedCaseNode] =
		useState<CaseTreeNode | null>(null);
	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'campaignManagerView') {
					setView(message.value);
				}
			}

			if (message.kind === 'webview.campaignManager.selectCase') {
				setSelectedCaseNode(message.node);
			}
		};

		window.addEventListener('message', handler);
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view || view.viewProps === null) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via Codemod Discovery or VS Code Command &
				check back later!
			</p>
		);
	}

	return (
		<main className="App">
			<ListView
				nodes={view.viewProps.nodes}
				selectedCaseNode={selectedCaseNode}
				setSelectedCaseNode={setSelectedCaseNode}
			/>
		</main>
	);
}

export default App;
