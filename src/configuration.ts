import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const showFileElements =
		configuration.get<boolean>('showFileElements') ?? false;

	return {
		saveDocumentOnJobAccept,
		showFileElements,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
