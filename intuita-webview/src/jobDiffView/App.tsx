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
			return data.map((props) => (
				<JobDiffView key={props.jobHash} {...props} />
			));
		default:
			return null;
	}
};

function App() {
	const [view, setView] = useState<View | null>(null);
	const eventHandler = useCallback(
		(event: MessageEvent<WebviewMessage>) => {
			if (view === null) {
				return;
			}

			const { data: message } = event;

			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}

			if (
				message.kind === 'webview.diffView.updateDiffViewProps' &&
				view.viewId === 'jobDiffView'
			) {
				const jobHash = message.data.jobHash ?? null;
				if (jobHash === null) {
					return;
				}

				const index = view.viewProps.data
					.slice()
					.findIndex((element) => element.jobHash === jobHash);
				if (index === -1) {
					return;
				}
				const viewData = view.viewProps.data
					.slice()
					.splice(index, 1, message.data);
				setView({
					...view,
					viewProps: {
						data: viewData,
					},
				});
			}
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
