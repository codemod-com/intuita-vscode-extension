import { exec } from 'node:child_process';
import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { isNeitherNullNorUndefined, singleQuotify } from '../utilities';
import * as vscode from 'vscode';

interface UserHooks {
	onDryRunCompleted: string | null;
}

type DryRunCompletedEnv = {
	DRY_RUN_CHANGED_FILES: string;
}


const buildEnvForDryRunCompleted = (message: Message & { kind: MessageKind.codemodSetExecuted}): DryRunCompletedEnv  => {

	const changedFilePaths = message.jobs
	.map(({ newContentUri }) => newContentUri?.fsPath)
	.filter(isNeitherNullNorUndefined)
	.map(singleQuotify);

const changedFilesAsPattern = changedFilePaths.join(' ');	

return {
	DRY_RUN_CHANGED_FILES: changedFilesAsPattern
}
}

export class UserHooksService {
	public constructor(
		private readonly __messageBus: MessageBus,
		private readonly __userHooks: UserHooks,
		private readonly __rootPath: string,
	) {
		this.__messageBus.subscribe(
			MessageKind.codemodSetExecuted,
			async (message) => {
				if (this.__userHooks.onDryRunCompleted === null) {
					return;
				}

				const command = this.__userHooks.onDryRunCompleted;
				const env = buildEnvForDryRunCompleted(message);

				exec(command, { cwd: this.__rootPath,  env: {...process.env, ...env}} , (err, res) => {
					if (err !== null) {
						vscode.window.showErrorMessage(err.message);
						return;
					}

					vscode.window.showInformationMessage(
						`Executed onDryRunCompleted hook: \n ${res}`,
					);
				});
			},
		);
	}
}
