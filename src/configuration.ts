import * as vscode from 'vscode';
import { GitExtension } from './types/git';
import { MessageBus, MessageKind } from './components/messageBus';
import { timeout } from './utilities';

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

	const repositoryPath = configuration.get<string>('repositoryPath');

	return {
		saveDocumentOnJobAccept,
		fileLimit,
		telemetryEnabled,
		workerThreadCount,
		repositoryPath,
		includePatterns,
		excludePatterns,
	};
};

export class DefaultConfigurationClass {
	#messageBus: MessageBus;
	constructor(messageBus: MessageBus) {
		this.#messageBus = messageBus;
		this.#messageBus.subscribe(MessageKind.extensionActivated, async () => {
			const repositoryPathFromConfig = getConfiguration().repositoryPath;
			if (!repositoryPathFromConfig) {
				try {
					const repositoryPath = await Promise.race([
						this.getGitRemote(),
						timeout(4000),
					]);

					if (!repositoryPath) {
						return;
					}
					await vscode.workspace
						.getConfiguration('intuita')
						.update(
							'repositoryPath',
							repositoryPath,
							vscode.ConfigurationTarget.Global,
						);
				} catch (error) {
					console.error('error', error);
				}
			}
		});
	}
	getGitRemote = () =>
		new Promise((resolve, reject) => {
			const gitExtension = vscode.extensions.getExtension(
				'vscode.git',
			) as vscode.Extension<GitExtension>;

			if (!gitExtension) {
				return reject(new Error('Git extension not found'));
			}
			if (!gitExtension.isActive) {
				gitExtension
					.activate()
					.then(() =>
						this.getPathFromGitExtension(gitExtension, resolve),
					);
			} else {
				this.getPathFromGitExtension(gitExtension, resolve);
			}
		});

	getPathFromGitExtension = (
		gitExtension: vscode.Extension<GitExtension>,
		resolve: (val: unknown) => void,
	) => {
		const gitApi = gitExtension.exports.getAPI(1);
		if (!gitApi.repositories.length) {
			gitApi.onDidOpenRepository((repo) => {
				repo.state.onDidChange(() => {
					resolve(repo.state.remotes[0]?.fetchUrl);
				});
			});
		}
		const remotePath = gitApi.repositories[0]?.state.remotes[0]?.pushUrl;
		if (remotePath) {
			return resolve(remotePath);
		}
	};
}

export type Configuration = ReturnType<typeof getConfiguration>;
