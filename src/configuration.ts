import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const fileLimit = configuration.get<number>('fileLimit') ?? 100;

	const telemetryUrl =
		configuration.get<string>('telemetryUrl') ?? 'http://localhost:4001';

	return {
		saveDocumentOnJobAccept,
		fileLimit,
		telemetryUrl,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
