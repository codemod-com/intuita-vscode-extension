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
			const { data } = view.viewProps;

			return (
				<JobDiffViewContainer jobs={data} postMessage={postMessage} />
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
				const jobHash = message.data.jobHash ?? null;
				if (jobHash === null) {
					return;
				}
				const dataCopy = [...view.viewProps.data];

				const index = dataCopy
					.slice()
					.findIndex((element) => element.jobHash === jobHash);
				if (index === -1) {
					return;
				}
				dataCopy.splice(index, 1, message.data);
				setView({
					...view,
					viewProps: {
						data: dataCopy,
					},
				});
			}
			if (
				message.kind === 'webview.diffview.rejectedJob' &&
				view?.viewId === 'jobDiffView'
			) {
				const jobHash = message.data[0];
				if (!jobHash) {
					return;
				}
				const viewData = [...view?.viewProps?.data];
				const index = viewData.findIndex(
					(el) => el.jobHash === jobHash,
				);
				if (index === -1) {
					return;
				}
				viewData.splice(index, 1);
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
