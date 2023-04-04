import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import CreateIssue from './CreateIssueView';
import { vscode } from './utilities/vscode';
import WarningMessage from './WarningMessage';
import CreatePR from './CreatePRView';
import type {
	View,
	WebviewMessage,
} from '../../src/components/webview/IntuitaPanel';
declare global {
	interface Window {
		INITIAL_STATE: {
			repositoryPath: string;
			userId: string;
		};
	}
}

const getViewComponent = (viewId: View['viewId']) => {
	switch (viewId) {
		case 'createIssue': {
			return CreateIssue;
		}
		case 'createPR':
			return CreatePR;
	}
};

function App() {
	const [configuredRepoPath, setConfiguredRepoPath] = useState<string | null>(
		window.INITIAL_STATE.repositoryPath,
	);
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

			if (message.kind === 'webview.global.setConfiguration') {
				setConfiguredRepoPath(message.value.repositoryPath);
			}

			if (message.kind === 'webview.global.setView') {
				setView(message.value);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	const handleLinkAccount = () => {
		vscode.postMessage({
			kind: 'webview.global.redirectToSignIn',
		});
	};

	const handleOpenExtensionSettings = () => {
		vscode.postMessage({
			kind: 'webview.global.openConfiguration',
		});
	};

	if (!configuredRepoPath) {
		return (
			<WarningMessage
				message="In order to create issues, configure you repository settings"
				actionButtons={[
					<VSCodeButton onClick={handleOpenExtensionSettings}>
						Open settings
					</VSCodeButton>,
				]}
			/>
		);
	}

	if (!linkedAccount) {
		<WarningMessage
			message="In order to create issues, link your Intuita account"
			actionButtons={[
				<VSCodeButton onClick={handleLinkAccount}>
					Link account
				</VSCodeButton>,
			]}
		/>;
	}

	if (!view) {
		return null;
	}

	const ViewComponent = getViewComponent(view.viewId);

	return (
		<main className="App">
			<ViewComponent {...view.viewProps} />
		</main>
	);
}

export default App;
