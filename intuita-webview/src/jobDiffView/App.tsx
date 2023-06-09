import { useCallback, useEffect, useRef, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import {
	View,
	WebviewMessage,
	JobDiffViewProps,
	JobAction,
} from '../shared/types';
import { JobDiffViewContainer } from './DiffViewer/index';
import './index.css';
import LoadingProgress from './Components/LoadingProgress';
import { makeid } from './util';

type MainViews = Extract<View, { viewId: 'jobDiffView' }>;

function App() {
	const [, forceUpdate] = useState('');
	const [jobIndex, setJobIndex] = useState<number>(0);
	const viewRef = useRef<MainViews | null>(null);

	const eventHandler = useCallback((event: MessageEvent<WebviewMessage>) => {
		const view = viewRef.current;
		const { data: message } = event;
		if (message.kind === 'webview.global.setView') {
			if (message.value.viewId === 'jobDiffView') {
				message.value.viewProps.data.sort((a, b) => {
					if (!a.newFileTitle || !b.newFileTitle) {
						return 0;
					}
					return a.newFileTitle.localeCompare(b.newFileTitle);
				});

				viewRef.current = message.value;
				forceUpdate(makeid(16));
			}
		}

		if (view === null) {
			return;
		}

		if (message.kind === 'webview.global.focusView') {
			const diffViewContainer =
				document.getElementById('diffViewContainer');

			diffViewContainer?.focus();
		}

		if (message.kind === 'webview.diffView.focusFile') {
			const index = view.viewProps.data.findIndex(
				(job) => job.jobHash === message.jobHash,
			);

			if (index === -1) {
				return;
			}

			setJobIndex(index);
		}

		if (message.kind === 'webview.diffView.focusFolder') {
			const folderPathExcludingRootPath = message.folderPath.slice(
				message.folderPath.indexOf('/'),
			);
			const index = view.viewProps.data.findIndex((job) =>
				job.newFileTitle?.includes(folderPathExcludingRootPath),
			);

			if (index === -1) {
				return;
			}

			setJobIndex(index);
		}
	}, []);

	useEffect(() => {
		window.addEventListener('message', eventHandler);

		return () => {
			window.removeEventListener('message', eventHandler);
		};
	}, [eventHandler]);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	const postMessage = useCallback((event: JobAction) => {
		vscode.postMessage({
			kind: event.command,
			value: event.arguments,
		});
	}, []);

	const view = viewRef.current;
	if (!view || view.viewId !== 'jobDiffView') {
		return null;
	}

	if (view.viewProps.loading) {
		return <LoadingProgress />;
	}

	const { data, showHooksCTA } = view.viewProps;
	const job = data[jobIndex];

	if (!job) {
		return null;
	}

	return (
		<main className="App">
			<JobDiffViewContainer
				job={job}
				showHooksCTA={showHooksCTA}
				postMessage={postMessage}
				totalJobsCount={data.length}
				jobIndex={jobIndex}
				setJobIndex={setJobIndex}
			/>
		</main>
	);
}
export type { JobDiffViewProps };
export default App;
