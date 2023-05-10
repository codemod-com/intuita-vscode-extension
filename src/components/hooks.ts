import { exec } from 'node:child_process';
import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { isNeitherNullNorUndefined, singleQuotify } from '../utilities';
import * as vscode from 'vscode';

interface Configuration {
	getConfiguration(): {
		onDryRunCompleted: string | null;
	};
}

type DryRunCompletedEnv = {
	DRY_RUN_CHANGED_FILES: string;
};

const buildEnvForDryRunCompleted = (
	message: Message & { kind: MessageKind.codemodSetExecuted },
): DryRunCompletedEnv => {
	const changedFilePaths = message.jobs
		.map(({ newContentUri }) => {
			if (newContentUri === null) {
				return;
			}

			return singleQuotify(newContentUri.fsPath);
		})
		.filter(isNeitherNullNorUndefined);

	const changedFilesAsPattern = changedFilePaths.join(' ');

	return {
		DRY_RUN_CHANGED_FILES: changedFilesAsPattern,
	};
};

export class UserHooksService {
	public constructor(
		private readonly __messageBus: MessageBus,
		private readonly __configuration: Configuration,
		private readonly __rootPath: string,
	) {
		this.__messageBus.subscribe(
			MessageKind.codemodSetExecuted,
			async (message) => {
				const { onDryRunCompleted: command } =
					this.__configuration.getConfiguration();

				if (command === null) {
					return;
				}

				const env = buildEnvForDryRunCompleted(message);

				exec(
					command,
					{ cwd: this.__rootPath, env: { ...process.env, ...env } },
					(err, res) => {
						if (err !== null) {
							vscode.window.showErrorMessage(err.message);
							return;
						}

						vscode.window.showInformationMessage(
							`Executed onDryRunCompleted hook: \n ${res}`,
						);
					},
				);
			},
		);
	}
}
