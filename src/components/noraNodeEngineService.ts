import * as t from 'io-ts';
import { FileSystem, StatusBarItem, Uri, workspace } from 'vscode';
import { spawn } from 'child_process';
import * as readline from 'node:readline';
import prettyReporter from 'io-ts-reporters';
import { Job, JobHash } from '../jobs/types';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { buildCaseHash } from '../cases/buildCaseHash';
import { MessageBus, MessageKind } from './messageBus';
import { buildRewriteFileJob } from '../jobs/rewriteFileJob';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { EngineService } from './engineService';

export class NoraNodeEngineService extends EngineService  {
	readonly #downloadService: DownloadService;
	readonly #globalStorageUri: Uri;

	public constructor(
		downloadService: DownloadService,
		fileSystem: FileSystem,
		globalStorageUri: Uri,
		messageBus: MessageBus,
		statusBarItem: StatusBarItem,
	) {
		super(
			CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE,
			messageBus,
			fileSystem,
			statusBarItem,
			'noraNodeEngineOutput',
		);

		this.#downloadService = downloadService;
		this.#globalStorageUri = globalStorageUri;
	}

	protected buildArguments(
		uri: Uri,
		outputUri: Uri,
		group: 'nextJs' | 'mui',
	): readonly string[] {
		const pattern = Uri.joinPath(uri, '**/*.tsx').fsPath;

		return [
			'-p',
			pattern,
			'-p',
			'!**/node_modules',
			'-g',
			group,
			'-l',
			'100',
			'-o',
			outputUri.fsPath,
		];
	}

	async bootstrapExecutableUri(): Promise<Uri> {
		await this.fileSystem.createDirectory(this.#globalStorageUri);

		const platform =
			process.platform === 'darwin'
				? 'macos'
				: encodeURIComponent(process.platform);

		const executableBaseName = `nora-node-engine-${platform}`;

		const executableUri = Uri.joinPath(
			this.#globalStorageUri,
			executableBaseName,
		);

		try {
			await this.#downloadService.downloadFileIfNeeded(
				`https://intuita-public.s3.us-west-1.amazonaws.com/nora-node-engine/${executableBaseName}`,
				executableUri,
				'755',
			);
		} catch (error) {
			if (!(error instanceof ForbiddenRequestError)) {
				throw error;
			}

			throw new Error(
				`Your platform (${process.platform}) is not supported.`,
			);
		}

		return executableUri;
	}
}
