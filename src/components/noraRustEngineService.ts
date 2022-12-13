import { FileSystem, StatusBarItem, Uri } from 'vscode';
import { CaseKind } from '../cases/types';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { MessageBus } from './messageBus';
import { EngineService } from './engineService';
import { Job } from '../jobs/types';
import { spawn } from 'child_process';

export class NoraRustEngineService extends EngineService {
	readonly #downloadService: DownloadService;
	readonly #globalStorageUri: Uri;

	public constructor(
		downloadService: DownloadService,
		fileSystem: FileSystem,
		globalStorageUri: Uri,
		messageBus: MessageBus,
		statusBarItem: StatusBarItem,
		noraRustEngine2
	) {
		super(
			CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE,
			messageBus,
			fileSystem,
			statusBarItem,
			'noraRustEngineOutput',
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
			'-d',
			uri.fsPath,
			'-p',
			`"${pattern}"`,
			'-a',
			'**/node_modules/**/*',
			'-g',
			group,
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

		const executableBaseName = `nora-rust-engine-${platform}`;

		const executableUri = Uri.joinPath(
			this.#globalStorageUri,
			executableBaseName,
		);

		this.statusBarItem.text = `$(loading~spin) Downloading the Nora Rust Engine if needed`;
		this.statusBarItem.show();

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
		} finally {
			this.statusBarItem.hide();
		}

		return executableUri;
	}

	async compare(jobs: ReadonlyArray<Job>) {
        // const executableUri = await this.#noraRustEngineService.bootstrapExecutableUri();

        this.#executableUri = Uri.file('/intuita/nora-rust-engine/target/release/nora-rust-engine-linux')

        const childProcess = spawn(
			this.#executableUri.fsPath,
			[],
			{
				stdio: 'pipe',
			},
		);

        const interfase = readline.createInterface(childProcess.stdout);

        const jobHashes: JobHash[] = [];

        let i = 0;

        interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === EngineMessageKind.compare) {
                if (message.e) {
                    jobHashes.push(message.i as JobHash);
                }

                ++i;
            }

            if (i === jobs.length) {
                childProcess.kill();
            }
        });

        for (const job of jobs) {
            childProcess.stdin.write(
                JSON.stringify({
                    k: 5,
                    i: job.hash,
                    l: job.inputUri,
                    o: job.outputUri,
                }),
            );
        }
    }
}
