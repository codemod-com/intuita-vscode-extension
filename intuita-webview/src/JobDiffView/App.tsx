import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import {
	View,
	WebviewMessage,
	JobDiffViewProps,
} from '../../../src/components/webview/webviewEvents';
import { JobDiffView } from './DiffViewer/index';
import './index.css';

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
			const { data: message } = e;
			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}
			if (message.kind === 'webview.diffView.updateDiffViewProps') {
				const { data } = message;
				if (
					view?.viewId === 'jobDiffView' &&
					view.viewProps.data.jobHash === data.jobHash
				) {
					setView({
						...view,
						viewProps: {
							data: {
								...data,
							},
						},
					});
				}
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [view]);

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
