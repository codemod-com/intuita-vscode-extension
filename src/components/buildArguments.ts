import { Uri } from 'vscode';
import type { Configuration } from '../configuration';
import type { Message, MessageKind } from './messageBus';
import { doubleQuotify, singleQuotify } from '../utilities';

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

	if (command.kind === 'executeRepomod') {
		const args: string[] = [];
		args.push('repomod');
		args.push('-f', singleQuotify(command.codemodHash));
		args.push('-i', singleQuotify(message.targetUri.fsPath));
		args.push('-o', singleQuotify(storageUri.fsPath));

		args.push(
			'--formatWithPrettier',
			String(configuration.formatWithPrettier),
		);

		return args;
	}

	if (command.kind === 'executeCodemod') {
		const args: string[] = [];
		args.push('-c', singleQuotify(doubleQuotify(command.codemodHash)));

		if (message.targetUriIsDirectory) {
			configuration.includePatterns.forEach((includePattern) => {
				const { fsPath } = Uri.joinPath(
					message.targetUri,
					includePattern,
				);

				args.push('-p', singleQuotify(fsPath));
			});

			configuration.excludePatterns.forEach((excludePattern) => {
				const { fsPath } = Uri.joinPath(
					message.targetUri,
					excludePattern,
				);

				args.push('-p', `!${singleQuotify(fsPath)}`);
			});
		} else {
			args.push('-p', singleQuotify(message.targetUri.fsPath));
		}

		args.push('-w', String(configuration.workerThreadCount));

		args.push('-l', String(configuration.fileLimit));

		args.push('-o', singleQuotify(storageUri.fsPath));

		args.push(
			'--formatWithPrettier',
			String(configuration.formatWithPrettier),
		);

		return args;
	}

	const args: string[] = [];

	configuration.includePatterns.forEach((includePattern) => {
		const { fsPath } = Uri.joinPath(message.targetUri, includePattern);

		args.push('-p', singleQuotify(fsPath));
	});

	configuration.excludePatterns.forEach((excludePattern) => {
		const { fsPath } = Uri.joinPath(message.targetUri, excludePattern);

		args.push('-p', `!${singleQuotify(fsPath)}`);
	});

	args.push('-w', String(configuration.workerThreadCount));

	args.push('-l', String(configuration.fileLimit));
	args.push('-f', singleQuotify(command.codemodUri.fsPath));
	args.push('-o', singleQuotify(storageUri.fsPath));

	args.push('--formatWithPrettier', String(configuration.formatWithPrettier));

	return args;
};
