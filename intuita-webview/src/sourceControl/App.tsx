import { useEffect, useState } from 'react';
import { WebviewMessage } from '../shared/types';
import './index.css';
import { vscode } from '../shared/utilities/vscode';
import styles from './style.module.css';
import CreateIssue from './CreateIssue';
import { SourceControlViewProps } from '../../../src/components/webview/sourceControlViewProps';

declare global {
	interface Window {
		sourceControlViewProps: SourceControlViewProps;
	}
}

export const App = () => {
	const [viewProps, setViewProps] = useState(window.sourceControlViewProps);

	useEffect(() => {
		vscode.postMessage({
			kind: 'webview.sourceControl.webviewMounted',
		});
	}, []);

	useEffect(() => {
		const eventHandler = (event: MessageEvent<WebviewMessage>) => {
			if (event.data.kind === 'webview.setSourceControlViewProps') {
				setViewProps(event.data.sourceControlViewProps);
			}
		};

		window.addEventListener('message', eventHandler);

		return () => {
			window.removeEventListener('message', eventHandler);
		};
	}, []);

	return (
		<main className={styles.app}>
			<CreateIssue body={viewProps.body} title={viewProps.title} />
		</main>
	);
};
