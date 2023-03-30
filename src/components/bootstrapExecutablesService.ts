import { FileSystem, Uri } from 'vscode';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { MessageBus, MessageKind } from './messageBus';
import { StatusBarItemManager } from './statusBarItemManager';

// aka bootstrap engines
export class BootstrapExecutablesService {
	#downloadService: DownloadService;
	#globalStorageUri: Uri;
	#fileSystem: FileSystem;
	#messageBus: MessageBus;
	#statusBarItemManager: StatusBarItemManager;

	constructor(
		downloadService: DownloadService,
		globalStorageUri: Uri,
		fileSystem: FileSystem,
		messageBus: MessageBus,
		statusBarItemManager: StatusBarItemManager,
	) {
		this.#downloadService = downloadService;
		this.#globalStorageUri = globalStorageUri;
		this.#fileSystem = fileSystem;
		this.#messageBus = messageBus;
		this.#statusBarItemManager = statusBarItemManager;

		messageBus.subscribe(MessageKind.bootstrapEngines, () =>
			this.#onBootstrapEngines(),
		);
	}

	async #onBootstrapEngines() {
		await this.#fileSystem.createDirectory(this.#globalStorageUri);

		this.#statusBarItemManager.moveToBootstrap();

		const [noraNodeEngineExecutableUri, noraRustEngineExecutableUri] =
			await Promise.all([
				// this.#bootstrapNoraNodeEngineExecutableUri(),
				Uri.file('/intuita/nora-node-engine/apps/nne/build/nne-linux'),
				this.#bootstrapNoraRustEngineExecutableUri(),
			]);

		this.#statusBarItemManager.moveToStandby();

		this.#messageBus.publish({
			kind: MessageKind.enginesBootstrapped,
			noraNodeEngineExecutableUri,
			noraRustEngineExecutableUri,
		});
	}

	async #bootstrapNoraNodeEngineExecutableUri(): Promise<Uri> {
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

	async #bootstrapNoraRustEngineExecutableUri(): Promise<Uri> {
		const platform =
			process.platform === 'darwin'
				? 'macos'
				: encodeURIComponent(process.platform);

		const executableBaseName = `nora-rust-engine-${platform}`;

		const executableUri = Uri.joinPath(
			this.#globalStorageUri,
			executableBaseName,
		);

		try {
			await this.#downloadService.downloadFileIfNeeded(
				`https://intuita-public.s3.us-west-1.amazonaws.com/nora-rust-engine/${executableBaseName}`,
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
