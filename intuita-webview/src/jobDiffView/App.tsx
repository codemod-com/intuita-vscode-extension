import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { WebviewMessage } from '../shared/types';
import { JobDiffViewContainer } from './DiffViewer/index';
import './index.css';
import type { PanelViewProps } from '../../../src/components/webview/panelViewProps';
import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';

declare global {
	interface Window {
		panelViewProps: PanelViewProps;
	}
}

export const App = () => {
	const [viewProps, setViewProps] = useState(window.panelViewProps);

	useEffect(() => {
		vscode.postMessage({
			kind: 'webview.jobDiffView.webviewMounted',
		});
	}, []);

	useEffect(() => {
		const eventHandler = (event: MessageEvent<WebviewMessage>) => {
			if (event.data.kind === 'webview.setPanelViewProps') {
				setViewProps(event.data.panelViewProps);
			}
		};

		window.addEventListener('message', eventHandler);

		return () => {
			window.removeEventListener('message', eventHandler);
		};
	}, []);

	if (viewProps.kind === 'CODEMOD') {
		return (
			<main className={styles.markdownContainer}>
				<ReactMarkdown children={viewProps.description} />
			</main>
		);
	}

	return (
		<main className={styles.app}>
			<JobDiffViewContainer {...viewProps} />
		</main>
	);
};
