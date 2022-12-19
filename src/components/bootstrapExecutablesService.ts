import { FileSystem, Uri } from 'vscode';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { Message, MessageBus, MessageKind } from './messageBus';
import { StatusBarItemManager } from './statusBarItemManager';

export class BootstrapExecutablesService {
	#downloadService: DownloadService;
	#globalStorageUri: Uri;
	#fileSystem: FileSystem;
	#messageBus: MessageBus;
	#noraNodeEngineExecutableUri: Uri | null = null;
	#noraRustEngineExecutableUri: Uri | null = null;
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

		messageBus.subscribe(MessageKind.bootstrapExecutables, (message) =>
			this.#onBootstrapExecutables(message),
		);
	}

	async #onBootstrapExecutables(
		message: Message & { kind: MessageKind.bootstrapExecutables },
	) {
		if (!this.#noraNodeEngineExecutableUri) {
			this.#noraNodeEngineExecutableUri =
				await this.#bootstrapNoraNodeEngineExecutableUri();
		}

		if (!this.#noraRustEngineExecutableUri) {
			this.#noraRustEngineExecutableUri =
				await this.#bootstrapNoraRustEngineExecutableUri();
		}

		this.#messageBus.publish({
			kind: MessageKind.executablesBootstrapped,
			command: message.command,
			noraNodeEngineExecutableUri: Uri.file('/intuita/nora-node-engine/apps/nne/build/nne-linux'),
			noraRustEngineExecutableUri: this.#noraRustEngineExecutableUri,
		});
	}

	async #bootstrapNoraNodeEngineExecutableUri(): Promise<Uri> {
		await this.#fileSystem.createDirectory(this.#globalStorageUri);

		const platform =
			process.platform === 'darwin'
				? 'macos'
				: encodeURIComponent(process.platform);

		const executableBaseName = `nora-node-engine-${platform}`;

		const executableUri = Uri.joinPath(
			this.#globalStorageUri,
			executableBaseName,
		);

		this.#statusBarItemManager.moveToBootstrap();

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
		await this.#fileSystem.createDirectory(this.#globalStorageUri);

		const platform =
			process.platform === 'darwin'
				? 'macos'
				: encodeURIComponent(process.platform);

		const executableBaseName = `nora-rust-engine-${platform}`;

		const executableUri = Uri.joinPath(
			this.#globalStorageUri,
			executableBaseName,
		);

		this.#statusBarItemManager.moveToBootstrap();

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
