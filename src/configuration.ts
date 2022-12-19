import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const showFileElements =
		configuration.get<boolean>('showFileElements') ?? false;

	const fileLimit = configuration.get<number>('fileLimit') ?? 100;

	return {
		saveDocumentOnJobAccept,
		showFileElements,
		fileLimit,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
