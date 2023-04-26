import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import ListView from './ListView';
import styles from './style.module.css';

import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';

type MainViews = Extract<View, { viewId: 'campaignManagerView' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				// @TODO separate View type to MainViews and SourceControlViews
				if (message.value.viewId === 'campaignManagerView') {
					setView(message.value);
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view || view.viewProps === null) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via VS Code Command &
				check back later!
			</p>
		);
	}

	return (
		<main className="App">
			<ListView node={view.viewProps.node} />
		</main>
	);
}

export default App;
