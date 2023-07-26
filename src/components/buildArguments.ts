import { Uri } from 'vscode';
import type { Configuration } from '../configuration';
import type { Message, MessageKind } from './messageBus';
import { singleQuotify } from '../utilities';

export const buildArguments = (
	configuration: Configuration,
	message: Omit<
		Message & { kind: MessageKind.executeCodemodSet },
		'storageUri'
	>,
	storageUri: Uri,
) => {
	const { command } = message;

	if (command.kind === 'executePiranhaRule') {
		const args: string[] = [];
		args.push('-i', singleQuotify(message.targetUri.fsPath));
		args.push('-c', singleQuotify(command.configurationUri.fsPath));
		args.push('-o', singleQuotify(storageUri.fsPath));
		args.push('-l', command.language);

		// configuration.includePatterns.forEach((includePattern) => {
		// 	const { fsPath } = Uri.joinPath(message.targetUri, includePattern);

		// 	args.push('-p', singleQuotify(fsPath));
		// });

		// configuration.excludePatterns.forEach((excludePattern) => {
		// 	const { fsPath } = Uri.joinPath(message.targetUri, excludePattern);

		// 	args.push('-a', singleQuotify(fsPath));
		// });

		return args;
	}

	const args: string[] = [];

	if (message.targetUriIsDirectory) {
		configuration.includePatterns.forEach((includePattern) => {
			const { fsPath } = Uri.joinPath(message.targetUri, includePattern);

			args.push('--includePattern', singleQuotify(fsPath));
		});

		configuration.excludePatterns.forEach((excludePattern) => {
			const { fsPath } = Uri.joinPath(message.targetUri, excludePattern);

			args.push('--excludePattern', `!${singleQuotify(fsPath)}`);
		});
	} else {
		args.push('--includePattern', singleQuotify(message.targetUri.fsPath));
	}

	args.push('--threadCount', String(configuration.workerThreadCount));
	args.push('--fileLimit', String(configuration.fileLimit));

	args.push('--usePrettier', String(configuration.formatWithPrettier));
	args.push('--useJson');
	args.push('--useCache');

	args.push('--dryRun');
	args.push('--outputDirectoryPath', singleQuotify(storageUri.fsPath));

	if (command.kind === 'executeCodemod') {
		args.push('--name', singleQuotify(command.name));
	} else {
		args.push('--sourcePath', singleQuotify(command.codemodUri.fsPath));
		args.push('--codemodEngine', 'jscodeshift');
	}

	return args;
};
