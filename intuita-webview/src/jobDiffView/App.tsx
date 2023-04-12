import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import {
	View,
	WebviewMessage,
	JobDiffViewProps,
 } from '../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffViewer';
 const getViewComponent = (view: View) => {
	switch (view.viewId) {
		case 'jobDiffView':
			const { data } = view.viewProps;
			return <JobDiffView {...data} />;
		default:
			return null;
	}
};

function App() {
	const [view, setView] = useState<View | null>(null);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			console.log('received message', message);

			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	if (!view) {
		return null;
	}

	return <main className="App">{getViewComponent(view)}</main>;
}
export type { JobDiffViewProps };
 export default App;
