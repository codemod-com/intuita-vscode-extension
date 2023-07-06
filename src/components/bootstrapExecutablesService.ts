import { FileSystem, Uri } from 'vscode';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { MessageBus, MessageKind } from './messageBus';

// aka bootstrap engines
export class BootstrapExecutablesService {
	#downloadService: DownloadService;
	#globalStorageUri: Uri;
	#fileSystem: FileSystem;
	#messageBus: MessageBus;

	constructor(
		downloadService: DownloadService,
		globalStorageUri: Uri,
		fileSystem: FileSystem,
		messageBus: MessageBus,
	) {
		this.#downloadService = downloadService;
		this.#globalStorageUri = globalStorageUri;
		this.#fileSystem = fileSystem;
		this.#messageBus = messageBus;

		messageBus.subscribe(MessageKind.bootstrapEngine, () =>
			this.#onBootstrapEngines(),
		);
	}

	async #onBootstrapEngines() {
		await this.#fileSystem.createDirectory(this.#globalStorageUri);

		// Uri.file('/intuita/nora-node-engine/apps/nne/build/nne-linux'),
		const noraNodeEngineExecutableUri =
			await this.#bootstrapNoraNodeEngineExecutableUri();

		const codemodEngineNodeExecutableUri = Uri.parse(
			'/intuita/codemod-engine-rust/target/release/codemod-engine-rust',
		);

		this.#messageBus.publish({
			kind: MessageKind.engineBootstrapped,
			noraNodeEngineExecutableUri,
			codemodEngineNodeExecutableUri,
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
}
