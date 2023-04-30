import { useCallback, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import {
	View,
	WebviewMessage,
	JobDiffViewProps,
	JobAction,
} from '../shared/types';
import { JobDiffViewContainer } from './DiffViewer/index';
import './index.css';

const getViewComponent = (
	view: View,
	postMessage: (arg: JobAction) => void,
) => {
	switch (view.viewId) {
		case 'jobDiffView':
			const { data, title, diffId, changesAccepted } = view.viewProps;

			return (
				<JobDiffViewContainer
					diffId={diffId}
					title={title}
					jobs={data}
					changesAccepted={changesAccepted}
					postMessage={postMessage}
				/>
			);

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

			if (view === null) {
				return;
			}

			if (
				message.kind === 'webview.diffView.updateDiffViewProps' &&
				view.viewId === 'jobDiffView'
			) {
				const jobHash = message.data.jobHash;
				const nextData = view.viewProps.data.map((element) =>
					element.jobHash === jobHash ? message.data : element,
				);

				setView({
					...view,
					viewProps: {
						...view.viewProps,
						data: nextData,
					},
				});
			}
			if (
				message.kind === 'webview.diffview.rejectedJob' &&
				view.viewId === 'jobDiffView'
			) {
				const jobHash = message.data[0];
				const nextData = view.viewProps.data.filter(
					(element) => element.jobHash !== jobHash,
				);

				setView({
					...view,
					viewProps: {
						...view.viewProps,
						data: nextData,
					},
				});
			}

			if (message.kind === 'webview.diffView.focusFile') {
				const elementId = `diffViewContainer-${message.jobHash}`;
				const element = document.getElementById(elementId);
				element?.scrollIntoView();
			}

			if(message.kind === 'webview.diffView.setChangesAccepted' && view.viewId ==='jobDiffView') {

				setView({
					...view, 
					viewProps: { ...view.viewProps, changesAccepted: message.value }
				})
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

	const postMessage = (event: JobAction) => {
		vscode.postMessage({
			kind: event.command,
			value: event.arguments,
		});
	};

	if (!view) {
		return null;
	}

	return <main className="App">{getViewComponent(view, postMessage)}</main>;
}
export type { JobDiffViewProps };
export default App;
