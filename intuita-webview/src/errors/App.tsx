import { useEffect, useState } from 'react';
import styles from './style.module.css';

import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import { vscode } from '../shared/utilities/vscode';

type ErrorView = Extract<View, { viewId: 'errors' }>;

export const App = () => {
	const [view, setView] = useState<ErrorView | null>(null);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				if (message.value.viewId === 'errors') {
					setView(message.value);
				}
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
				Choose a Codemod from Codemod Runs to see its errors.
			</p>
		);
	}

	return <main></main>;
};
