import { FileSystem, StatusBarItem, Uri } from 'vscode';
import { CaseKind } from '../cases/types';
import { MessageBus } from './messageBus';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { EngineService } from './engineService';
import { NoraRustEngine2 } from './NoraRustEngineService2';

export class NoraNodeEngineService extends EngineService {
	readonly #downloadService: DownloadService;
	readonly #globalStorageUri: Uri;

	public constructor(
		downloadService: DownloadService,
		fileSystem: FileSystem,
		globalStorageUri: Uri,
		messageBus: MessageBus,
		statusBarItem: StatusBarItem,
		noraRustEngine2: NoraRustEngine2,
	) {
		super(
			CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE,
			messageBus,
			fileSystem,
			statusBarItem,
			'noraNodeEngineOutput',
			noraRustEngine2,
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

		this.statusBarItem.text = `$(loading~spin) Downloading the Nora Node Engine if needed`;
		this.statusBarItem.show();

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
		} finally {
			this.statusBarItem.hide();
		}

		return executableUri;
	}
}
