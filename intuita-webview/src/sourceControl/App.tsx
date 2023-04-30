import { useEffect, useState } from 'react';

import { vscode } from '../shared/utilities/vscode';

import CreateIssue from './CreateIssueView';
import CommitView from './CommitView';

import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';

declare global {
	interface Window {
		INITIAL_STATE: {
			userId: string | null;
		};
	}
}

// @ts-ignore
const getViewComponent = (view: View, hasLinkedAccount: boolean) => {
	switch (view.viewId) {
		case 'createIssue': {
			return <CreateIssue {...view.viewProps} />;
		}
		case 'commitView':
			return (
				<CommitView
					{...view.viewProps}
					hasLinkedAccount={hasLinkedAccount}
				/>
			);
	}
};

function App() {
	const [linkedAccount, setLinkedAccount] = useState<string | null>(
		window.INITIAL_STATE.userId,
	);

	const [view, setView] = useState<View | null>(null);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (message.kind === 'webview.global.setUserAccount') {
				setLinkedAccount(message.value);
			}

			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}

			if (
				message.kind === 'webview.createIssue.submittingIssue' &&
				view?.viewId === 'createIssue'
			) {
				setView({
					...view,
					viewProps: {
						...view.viewProps,
						initialFormData: {},
						loading: message.value,
					},
				});
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [view]);

	if (!view) {
		return null;
	}

	const hasLinkedAccount = Boolean(linkedAccount);

	return (
		<main className="App">{getViewComponent(view, hasLinkedAccount)}</main>
	);
}

export default App;
