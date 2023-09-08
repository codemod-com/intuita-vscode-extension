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

		const codemodArguments = (command.arguments ?? []).flatMap(
			({ name, value }) => [`--arg:${name}`, String(value)],
		);
		args.push(...codemodArguments);

		return args;
	}

	const args: string[] = [];

	if (command.kind === 'executeCodemod') {
		args.push(singleQuotify(command.name));
		const codemodArguments = (command.arguments ?? []).flatMap(
			({ name, value }) => [`--arg:${name}`, String(value)],
		);
		args.push(...codemodArguments);
	} else {
		args.push('--sourcePath', singleQuotify(command.codemodUri.fsPath));
		args.push('--codemodEngine', 'jscodeshift');
	}

	args.push('--targetPath', singleQuotify(message.targetUri.fsPath));

	if (message.targetUriIsDirectory) {
		configuration.includePatterns.forEach((includePattern) => {
			const { fsPath } = Uri.joinPath(message.targetUri, includePattern);

			args.push('--include', singleQuotify(fsPath));
		});

		configuration.excludePatterns.forEach((excludePattern) => {
			const { fsPath } = Uri.joinPath(message.targetUri, excludePattern);

			args.push('--exclude', singleQuotify(fsPath));
		});
	} else {
		args.push('--include', singleQuotify(message.targetUri.fsPath));
	}

	args.push('--threadCount', String(configuration.workerThreadCount));
	args.push('--fileLimit', String(configuration.fileLimit));

	if (configuration.formatWithPrettier) {
		args.push('--usePrettier');
	}

	args.push('--useJson');
	args.push('--useCache');

	args.push('--dryRun');
	args.push('--outputDirectoryPath', singleQuotify(storageUri.fsPath));

	return args;
};
