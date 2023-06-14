import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import ListView from './ListView';
import styles from './style.module.css';
import '../shared/util.css';
import type {
	CaseTreeNode,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';

const handleItemClick = (node: CaseTreeNode) => {
	vscode.postMessage({
		kind: 'webview.campaignManager.setSelectedCaseHash',
		caseHash: node.id,
	});

	node.commands?.forEach((command) => {
		vscode.postMessage({
			kind: 'webview.command',
			value: command,
		});
	});
};

function App() {
	const [viewProps, setViewProps] = useState(
		window.INITIAL_STATE.codemodRunsProps,
	);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.codemodRuns.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'campaignManagerView') {
					setViewProps(message.value.viewProps);
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	const { selectedCaseHash, nodes } = viewProps;

	if (nodes.length === 0) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via Codemod Discovery or
				VS Code Command & check back later!
			</p>
		);
	}

	return (
		<main>
			<ListView
				nodes={nodes}
				selectedCaseHash={selectedCaseHash}
				onItemClick={handleItemClick}
			/>
		</main>
	);
}

export default App;
