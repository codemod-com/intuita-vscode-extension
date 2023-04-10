import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const fileLimit = configuration.get<number>('fileLimit') ?? 100;

	const telemetryConfiguration =
		vscode.workspace.getConfiguration('telemetry');

	const telemetryLevel =
		telemetryConfiguration.get<string>('telemetryLevel') ?? 'all';

	const telemetryEnabled =
		telemetryLevel !== 'off'
			? configuration.get<boolean>('telemetryEnabled') ?? true
			: false;

	const workerThreadCount =
		configuration.get<number>('workerThreadCount') ?? 4;
	const includePatterns = configuration.get<string[]>('includePatterns') ?? [
		'**/*.{js,ts,jsx,tsx,cjs,mjs}',
	];
	const excludePatterns = configuration.get<string[]>('excludePatterns') ?? [
		'**/node_modules',
	];

	return {
		saveDocumentOnJobAccept,
		fileLimit,
		telemetryEnabled,
		workerThreadCount,
		includePatterns,
		excludePatterns,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
