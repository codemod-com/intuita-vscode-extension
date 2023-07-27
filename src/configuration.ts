import * as vscode from 'vscode';

export const getConfiguration = () => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	const fileLimit = configuration.get<number>('fileLimit') ?? 100;

	const workerThreadCount =
		configuration.get<number>('workerThreadCount') ?? 4;

	const includePatterns = configuration.get<string[]>(
		'engineIncludePatterns',
	) ?? ['**/*.{js,ts,jsx,tsx,cjs,mjs}'];
	const excludePatterns = configuration.get<string[]>(
		'engineExcludePatterns',
	) ?? ['**/node_modules/**/*.*'];

	const formatWithPrettier =
		configuration.get<boolean>('formatWithPrettier') ?? false;

	return {
		fileLimit,
		workerThreadCount,
		includePatterns,
		excludePatterns,
		formatWithPrettier,
	};
};

export const setConfigurationProperty = async (
	propertyName: string,
	value: unknown,
	configurationTarget: vscode.ConfigurationTarget,
) => {
	const configuration = vscode.workspace.getConfiguration('intuita');

	return configuration.update(propertyName, value, configurationTarget);
};
export type Configuration = ReturnType<typeof getConfiguration>;
