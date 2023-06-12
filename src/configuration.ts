import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const saveDocumentOnJobAccept =
		configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

	const fileLimit = configuration.get<number>('fileLimit') ?? 100;

	const workerThreadCount =
		configuration.get<number>('workerThreadCount') ?? 4;
	const includePatterns = configuration.get<string[]>('includePatterns') ?? [
		'**/*.{js,ts,jsx,tsx,cjs,mjs}',
	];
	const excludePatterns = configuration.get<string[]>('excludePatterns') ?? [
		'**/node_modules',
	];

	const onDryRunCompleted =
		configuration.get<string>('onDryRunCompleted') || null;

	const formatWithPrettier = configuration.get<boolean>('formatWithPrettier') ?? false;

	return {
		saveDocumentOnJobAccept,
		fileLimit,
		workerThreadCount,
		includePatterns,
		excludePatterns,
		onDryRunCompleted,
		formatWithPrettier,
	};
};

export type Configuration = ReturnType<typeof getConfiguration>;
