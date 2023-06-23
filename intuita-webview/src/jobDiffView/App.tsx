import { useEffect, useState } from 'react';
import { WebviewMessage } from '../shared/types';
import { JobDiffViewContainer } from './DiffViewer/index';
import './index.css';
import type { PanelViewProps } from '../../../src/components/webview/panelViewProps';

declare global {
	interface Window {
		panelViewProps: PanelViewProps;
	}
}

export const App = () => {
	const [viewProps, setViewProps] = useState(window.panelViewProps);

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
		// a placeholder for the codemod description (Markdown)
		return null;
	}

	return (
		<main className="App">
			<JobDiffViewContainer {...viewProps} />
		</main>
	);
};
