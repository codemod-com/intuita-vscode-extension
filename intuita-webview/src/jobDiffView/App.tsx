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
	const eventHandler = useCallback(
		(event: MessageEvent<WebviewMessage>) => {
			const { data: message } = event;
			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}
			// if (message.kind === 'webview.diffView.updateDiffViewProps') {
			// 	if (!view || view.viewId !== 'jobDiffView') {
			// 		return;
			// 	}
			// 	const { data } = message;

			// 	const foundJobWithSameHash = view.viewProps?.data?.find(
			// 		(el) => el.jobHash === data.jobHash,
			// 	);
			// 	if (foundJobWithSameHash) {
			// 		const newViewProps = view.viewProps?.data?.map((el) => {
			// 			if (el.jobHash === data.jobHash) {
			// 				return {
			// 					...data,
			// 				};
			// 			}
			// 			return el;
			// 		});

			// 		setView({
			// 			...view,
			// 			viewProps: {
			// 				data: {
			// 					...newViewProps,
			// 				},
			// 			},
			// 		});
			// 	}
			// }
		},
		[view],
	);

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
