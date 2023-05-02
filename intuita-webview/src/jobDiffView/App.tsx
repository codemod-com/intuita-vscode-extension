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
			const { data, title, diffId } = view.viewProps;

			return (
				<JobDiffViewContainer
					diffId={diffId}
					title={title}
					jobs={data}
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

			if (message.kind === 'webview.diffView.focusFile') {
				const elementId = `diffViewHeader-${message.jobHash}`;
				const element = document.getElementById(elementId);
				element?.scrollIntoView();
			}

			if (
				message.kind === 'webview.diffView.focusFolder' &&
				view.viewId === 'jobDiffView' &&
				view.viewProps.diffId
			) {
				const folderPathExcludingRootPath = message.folderPath.slice(
					message.folderPath.indexOf('/'),
				);

				const element =
					document.getElementById(
						`diffViewer-${view.viewProps.diffId}`,
					) ?? null;

				if (element === null) {
					return;
				}

				const fileInsideSelectedFolder =
					Array.from(element.children).find((child) =>
						child.id.includes(folderPathExcludingRootPath),
					) ?? null;

				if (fileInsideSelectedFolder === null) {
					return;
				}

				fileInsideSelectedFolder.scrollIntoView();
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
