import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import CreateIssue from './CreateIssueView';
import { vscode } from './utilities/vscode';
import WarningMessage from './WarningMessage';
import CreatePR from './CreatePRView';
declare global {
	interface Window {
		INITIAL_STATE: {
			repositoryPath: string;
			userId: string;
		};
	}
}

enum MessageKind {
	onAfterLinkedAccount = 26,
	onAfterUnlinkedAccount = 27,
	onAfterConfigurationChanged = 28,
	onBeforeCreateIssue = 29,
	onAfterCreateIssue = 30,
}

type Message =
	| Readonly<{
			kind: MessageKind.onAfterUnlinkedAccount;
	  }>
	| Readonly<{
			kind: MessageKind.onAfterLinkedAccount;
			account: string;
	  }>
	| Readonly<{
			kind: MessageKind.onAfterConfigurationChanged;
			nextConfiguration: {
				repositoryPath: string;
			};
	  }>
	| Readonly<{
			kind: MessageKind.onBeforeCreateIssue;
	  }>
	| Readonly<{
			kind: MessageKind.onAfterCreateIssue;
	  }>;

type ViewId = 'createIssue' | 'createPR';

type View =
	| Readonly<{
			viewId: ViewId;
			viewProps: {
				error: string;
				loading: boolean;
				initialFormData: Partial<{
					title: string;
					body: string;
				}>;
			};
	  }>
	| Readonly<{
			viewId: ViewId;
			viewProps: {
				loading: boolean;
				error: string;
				initialFormData: Partial<{
					title: string;
					body: string;
					baseBranch: string;
					targetBranch: string;
				}>;
			};
	  }>;

const getViewComponent = (viewId: ViewId) => {
	switch (viewId) {
		case 'createIssue': {
			return CreateIssue;
		}
		case 'createPR':
			return CreatePR;
	}
};

function App() {
	const [configuredRepoPath, setConfiguredRepoPath] = useState(
		!!window.INITIAL_STATE.repositoryPath,
	);
	const [linkedAccount, setLinkedAccount] = useState(
		!!window.INITIAL_STATE.userId,
	);

	const [view, setView] = useState<View | null>(null);

	useEffect(() => {
		const handler = (e: MessageEvent<Message>) => {
			const message = e.data;

			if (message.kind === MessageKind.onAfterLinkedAccount) {
				setLinkedAccount(true);
			}

			if (message.kind === MessageKind.onAfterUnlinkedAccount) {
				setLinkedAccount(false);
			}

			if (message.kind === MessageKind.onAfterConfigurationChanged) {
				const hasConfigPath =
					!!message.nextConfiguration.repositoryPath.trim().length;
				setConfiguredRepoPath(hasConfigPath);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	const handleLinkAccount = () => {
		vscode.postMessage({
			command: 'intuita.redirect',
			value: 'https://codemod.studio/auth/sign-in',
		});
	};

	const handleOpenExtensionSettings = () => {
		vscode.postMessage({
			command: 'workbench.action.openSettings',
			value: '@ext:Intuita.intuita-vscode-extension',
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
					Link account{' '}
				</VSCodeButton>,
			]}
		/>;
	}

	if (!view) return null;

	const ViewComponent = getViewComponent(view?.viewId);

	return (
		<main className="App">
			<ViewComponent {...view?.viewProps} />
		</main>
	);
}

export default App;
