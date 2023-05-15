import { useCallback, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import {
	View,
	WebviewMessage,
	JobDiffViewProps,
	JobAction,
	JobHash,
} from '../shared/types';
import { JobDiffViewContainer } from './DiffViewer/index';
import './index.css';
import LoadingProgress from './Components/LoadingProgress';

type MainViews = Extract<View, { viewId: 'jobDiffView' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);
	const [stagedJobs, setStagedJobs] = useState<JobHash[]>([]);
	const [jobIndex, setJobIndex] = useState<number>(0);
	const eventHandler = useCallback(
		(event: MessageEvent<WebviewMessage>) => {
			const { data: message } = event;
			if (message.kind === 'webview.global.setView') {
				if (message.value.viewId === 'jobDiffView') {
					message.value.viewProps.data.sort((a, b) => {
						if (!a.newFileTitle || !b.newFileTitle) {
							return 0;
						}
						return a.newFileTitle.localeCompare(b.newFileTitle);
					});
					setView(message.value);
				}
			}

			if (view === null) {
				return;
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

			if (message.kind === 'webview.diffView.updateStagedJobs') {
				setStagedJobs(message.value);
			}
		},
		[view],
	);

	useEffect(() => {
		if (view?.viewProps && view.viewId === 'jobDiffView') {
			setStagedJobs(view.viewProps.stagedJobs);
		}
	}, [view?.viewId, view?.viewProps]);

	useEffect(() => {
		window.addEventListener('message', eventHandler);

		return () => {
			window.removeEventListener('message', eventHandler);
		};
	}, [eventHandler, view]);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	const postMessage = useCallback((event: JobAction) => {
		vscode.postMessage({
			kind: event.command,
			value: event.arguments,
		});
	}, []);

	if (!view || view.viewId !== 'jobDiffView') {
		return null;
	}

	if (view.viewProps.loading) {
		return <LoadingProgress />;
	}

	const { data, diffId, showHooksCTA } = view.viewProps;

	return (
		<main className="App">
			<JobDiffViewContainer
				diffId={diffId}
				jobs={[data[jobIndex]!]}
				stagedJobs={stagedJobs}
				showHooksCTA={showHooksCTA}
				postMessage={postMessage}
			/>
		</main>
	);
}
export type { JobDiffViewProps };
export default App;
