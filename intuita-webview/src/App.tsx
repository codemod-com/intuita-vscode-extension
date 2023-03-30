import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { useEffect, useState } from 'react';
import CreateIssue from './CreateIssueView';
import { vscode } from './utilities/vscode';
import WarningMessage from './WarningMessage';
declare global {
  interface Window {
    INITIAL_STATE: { 
			repositoryPath: string, 
			userId: string
		};
  }
}

enum MessageKind {
	/**
	 * account events
	 */
	onAfterLinkedAccount = 26, 
	onAfterUnlinkedAccount = 27, 
	onAfterConfigurationChanged = 28
};

type 	Message  = | Readonly<{
	kind: MessageKind.onAfterUnlinkedAccount
}>
| Readonly<{
	kind: MessageKind.onAfterLinkedAccount, 
	account: string
}>
| 
Readonly<{
	kind: MessageKind.onAfterConfigurationChanged, 
	nextConfiguration: {
		repositoryPath: string
	}
}>;


function App() {
	const [configuredRepoPath, setConfiguredRepoPath] = useState(!!window.INITIAL_STATE.repositoryPath);
	const [linkedAccount, setLinkedAccount] = useState(!!window.INITIAL_STATE.userId);

	useEffect(() => {
		const handler = (e: MessageEvent<Message>) => {
			const message = e.data;

			if(message.kind === MessageKind.onAfterLinkedAccount) {
				setLinkedAccount(true);
			}

			if(message.kind === MessageKind.onAfterUnlinkedAccount) {
				setLinkedAccount(false);
			}

			if(message.kind === MessageKind.onAfterConfigurationChanged) {
				const hasConfigPath = !!message.nextConfiguration.repositoryPath.trim().length;
				setConfiguredRepoPath(hasConfigPath);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener("message", handler);
		}
	}, []);

	const handleLinkAccount  =() => {
    vscode.postMessage({
			command: 'intuita.redirect',
      value: 'https://codemod.studio/auth/sign-in'
		});
  }

	const handleOpenExtensionSettings  =() => {

    vscode.postMessage({
			command: 'workbench.action.openSettings',
      value: '@ext:Intuita.intuita-vscode-extension'
		});
  }

	return (
		<main className="App">
			{ (configuredRepoPath && linkedAccount)  ? <CreateIssue /> : null }

			{ !configuredRepoPath ? <WarningMessage
				message='In order to create issues, configure you repository settings' 
				actionButtons={[ <VSCodeButton onClick={handleOpenExtensionSettings}>Open settings</VSCodeButton>]}
			/> : null }

			{ !linkedAccount ? <WarningMessage
				message='In order to create issues, link your Intuita account' 
				actionButtons={[ <VSCodeButton onClick={handleLinkAccount}>Link account </VSCodeButton>]}
			/> : null }
		</main>
	);
}

export default App;
