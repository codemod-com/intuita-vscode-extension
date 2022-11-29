import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const buildCodeRepairJobsOnDocumentSave =
		configuration.get<boolean>('buildCodeRepairJobsOnDocumentSave') ??
		false;

	const showFileElements =
		configuration.get<boolean>('showFileElements') ?? false;

	return {
		saveDocumentOnJobAccept,
		buildCodeRepairJobsOnDocumentSave,
		showFileElements,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
