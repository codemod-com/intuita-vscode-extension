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

function App() {
	const [view, setView] = useState<View | null>(null);
	const [scrollIntoHash, setScrollIntoHash] = useState<JobHash | null>(null);
	const [scrollIntoFolderPath, setScrollIntoFolderPath] = useState<
		string | null
	>(null);
	const [stagedJobs, setStagedJobs] = useState<JobHash[]>([]);
	const eventHandler = useCallback(
		(event: MessageEvent<WebviewMessage>) => {
			const { data: message } = event;
			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}

			if (view === null) {
				return;
			}

			if (message.kind === 'webview.diffView.focusFile') {
				setScrollIntoHash(message.jobHash);
			}

			if (message.kind === 'webview.diffView.focusFolder') {
				const folderPathExcludingRootPath = message.folderPath.slice(
					message.folderPath.indexOf('/'),
				);
				setScrollIntoFolderPath(folderPathExcludingRootPath);
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
	data.sort((a, b) => {
		if (!a.newFileTitle || !b.newFileTitle) {
			return 0;
		}
		return a.newFileTitle.localeCompare(b.newFileTitle);
	});

	return (
		<main className="App">
			<JobDiffViewContainer
				scrollIntoHash={scrollIntoHash}
				scrollIntoFolderPath={scrollIntoFolderPath}
				diffId={diffId}
				jobs={data}
				stagedJobs={stagedJobs}
				showHooksCTA={showHooksCTA}
				postMessage={postMessage}
			/>
		</main>
	);
}
export type { JobDiffViewProps };
export default App;
