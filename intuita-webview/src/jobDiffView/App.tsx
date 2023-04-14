import { useCallback, useEffect, useState } from 'react';
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
			return data.map((el) => <JobDiffView key={el.jobHash} {...el} />);
		default:
			return null;
	}
};

function App() {
	const [view, setView] = useState<View | null>(null);
	const eventHandler = useCallback((event: MessageEvent<WebviewMessage>) => {
		const { data: message } = event;
		if (message.kind === 'webview.global.setView') {
			setView(message.value);
		}
		if(message.kind === 'webview.diffView.updateDiffViewProps' && view?.viewId === 'jobDiffView') {
			const jobHash = message?.data?.jobHash;
 			if(!jobHash) {
				return
			}
			const viewData = [...view?.viewProps?.data];
			const index = viewData.findIndex((el) => el.jobHash === jobHash);
			if(index === -1) {
				return;
			}
			viewData[index] = message.data;
			setView({
				...view,
				viewProps: {
 					data: viewData
				}
			})


		}
	}, [view]);

	useEffect(() => {
		window.addEventListener('message', eventHandler);

		return () => {
			window.removeEventListener('message', eventHandler);
		};
	}, [eventHandler, view]);

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
