import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const fileLimit = configuration.get<number>('fileLimit') ?? 100;

	const telemetryConfiguration = vscode.workspace.getConfiguration('telemetry');

	const telemetryLevel = telemetryConfiguration.get<string>('telemetryLevel') ?? 'all'

	const telemetryEnabled = telemetryLevel !== 'off'
		? (configuration.get<boolean>('telemetryEnabled') ?? true)
		: false;

	return {
		saveDocumentOnJobAccept,
		fileLimit,
		telemetryEnabled,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
