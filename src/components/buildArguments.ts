import { Uri } from 'vscode';
import type { Configuration } from '../configuration';
import type { Message, MessageKind } from './messageBus';
import { doubleQuotify, singleQuotify } from '../utilities';
import { sep } from 'path';

const buildGlobPattern = (targetUri: Uri, pattern?: string) => {
	const { fsPath: targetUriFsPath } = targetUri;

	// Glob patterns should always use / as a path separator, even on Windows systems, as \ is used to escape glob characters.
	return targetUriFsPath
		.split(sep)
		.join('/')
		.concat(pattern ?? '');
};

const buildCrossplatformArg = (str: string) => {
	const isWin = process.platform === 'win32';
	// remove trailing "\"
	return isWin ? doubleQuotify(str.replace(/\\+$/, '')) : singleQuotify(str);
};

export const buildArguments = (
	configuration: Configuration,
	message: Omit<
		Message & { kind: MessageKind.executeCodemodSet },
		'storageUri'
	>,
	storageUri: Uri,
) => {
	const { command } = message;
	const args: string[] = [];

	const codemodArguments =
		command.kind !== 'executeLocalCodemod'
			? (command.arguments ?? []).flatMap(({ name, value }) => [
					`--arg:${name}`,
					String(value),
			  ])
			: [];

	if (command.kind === 'executePiranhaRule') {
		args.push('-i', buildCrossplatformArg(message.targetUri.fsPath));
		args.push('-c', buildCrossplatformArg(command.configurationUri.fsPath));
		args.push('-o', buildCrossplatformArg(storageUri.fsPath));
		args.push('-l', command.language);
		args.push(...codemodArguments);
		return args;
	}

	if (command.kind === 'executeCodemod') {
		args.push(buildCrossplatformArg(command.name));
	} else {
		args.push(
			'--sourcePath',
			buildCrossplatformArg(command.codemodUri.fsPath),
		);
		args.push('--codemodEngine', 'jscodeshift');
	}

	args.push('--targetPath', buildCrossplatformArg(message.targetUri.fsPath));

	if (message.targetUriIsDirectory) {
		configuration.includePatterns.forEach((includePattern) => {
			args.push(
				'--include',
				buildCrossplatformArg(
					buildGlobPattern(message.targetUri, includePattern),
				),
			);
		});

		configuration.excludePatterns.forEach((excludePattern) => {
			args.push(
				'--exclude',
				buildCrossplatformArg(
					buildGlobPattern(message.targetUri, excludePattern),
				),
			);
		});
	} else {
		args.push(
			'--include',
			buildCrossplatformArg(buildGlobPattern(message.targetUri)),
		);
	}

	args.push('--threadCount', String(configuration.workerThreadCount));
	args.push('--fileLimit', String(configuration.fileLimit));

	if (configuration.formatWithPrettier) {
		args.push('--usePrettier');
	}

	args.push('--useJson');
	args.push('--useCache');

	args.push('--dryRun');
	args.push(
		'--outputDirectoryPath',
		buildCrossplatformArg(storageUri.fsPath),
	);
	args.push(...codemodArguments);
	return args;
};
