import * as t from 'io-ts';
import { FileSystem, Uri, workspace } from 'vscode';
import { spawn } from 'child_process';
import * as readline from 'node:readline';
import { buildTypeCodec, ReplacementEnvelope } from './inferenceService';
import prettyReporter from 'io-ts-reporters';
import { buildFile } from '../files/buildFile';
import { UriHash } from '../uris/types';
import { File } from '../files/types';
import { Job } from '../jobs/types';
import { buildUriHash } from '../uris/buildUriHash';
import { buildRepairCodeJob } from '../features/repairCode/job';
import {
	CaseKind,
	CaseWithJobHashes,
	RepairCodeByPolyglotPiranhaCaseSubKind,
} from '../cases/types';
import { buildCaseHash } from '../cases/buildCaseHash';
import { MessageBus, MessageKind } from './messageBus';
import { buildRewriteFileJob } from '../features/rewriteFile/job';
import { DownloadService, ForbiddenRequestError } from './downloadService';



const messageCodec = t.union([
	buildTypeCodec({
		k: t.literal(1),
		p: t.string,
		r: t.tuple([t.number, t.number]),
		t: t.string,
		c: t.string,
	}),
	buildTypeCodec({
		k: t.literal(2),
	}),
	buildTypeCodec({
		k: t.literal(3),
		i: t.string,
		o: t.string,
		c: t.string,
	}),
]);

export class NoraNodeEngineService {
	readonly #downloadService: DownloadService;
	readonly #messageBus: MessageBus;
	readonly #fileSystem: FileSystem;
	readonly #globalStorageUri: Uri;

	#executableUri: Uri | null = null;

	public constructor(
		downloadService: DownloadService,
		globalStorageUri: Uri,
		messageBus: MessageBus,
		fileSystem: FileSystem,
	) {
		this.#downloadService = downloadService;
		this.#globalStorageUri = globalStorageUri;
		this.#messageBus = messageBus;
		this.#fileSystem = fileSystem;
	}

	async buildRepairCodeJobs(storageUri: Uri) {
		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		const { executableUri } = await this.#bootstrap();

		await this.#fileSystem.createDirectory(storageUri);

		const outputUri = Uri.joinPath(storageUri, 'noraNodeEngineOutput');

		await this.#fileSystem.createDirectory(outputUri);

		const pattern = Uri.joinPath(uri, '**/*.tsx').fsPath;

		const childProcess = spawn(
			executableUri.fsPath,
			['-p', pattern, '-p', '!**/node_modules', '-o', outputUri.fsPath],
			{
				stdio: 'pipe',
			},
		);

		const i = readline.createInterface(childProcess.stdout);

		const uriHashFileMap = new Map<UriHash, File>();
		const nextJsLinkJobs: Job[] = [];

		i.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === 1) {
				const uri = Uri.parse(message.p);
				const uriHash = buildUriHash(uri);

				let file = uriHashFileMap.get(uriHash);

				if (!file) {
					const document = await workspace.openTextDocument(uri);

					file = buildFile(uri, document.getText(), document.version);

					uriHashFileMap.set(uriHash, file);
				}

				const replacementEnvelope: ReplacementEnvelope = {
					range: {
						start: message.r[0],
						end: message.r[1],
					},
					replacement: message.t,
				};

				const job = buildRepairCodeJob(file, null, replacementEnvelope);

				nextJsLinkJobs.push(job);
			} else if (message.k === 3) {
				const inputUri = Uri.file(message.i);
				const outputUri = Uri.file(message.o);

				const job = buildRewriteFileJob(inputUri, outputUri, message.c);

				nextJsLinkJobs.push(job);
			}
		});

		i.on('close', () => {
			const casesWithJobHashes: CaseWithJobHashes[] = [];

			if (nextJsLinkJobs[0]) {
				const kind = CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA;
				const subKind =
					RepairCodeByPolyglotPiranhaCaseSubKind.NEXT_JS_LINK;

				const kase = {
					kind,
					subKind,
				} as const;

				const caseWithJobHashes: CaseWithJobHashes = {
					hash: buildCaseHash(kase, nextJsLinkJobs[0].hash),
					kind,
					subKind,
					jobHashes: new Set(nextJsLinkJobs.map((job) => job.hash)),
				};

				casesWithJobHashes.push(caseWithJobHashes);
			}

			const jobs = nextJsLinkJobs;

			this.#messageBus.publish({
				kind: MessageKind.upsertCases,
				uriHashFileMap,
				casesWithJobHashes,
				jobs,
				inactiveJobHashes: new Set(),
				inactiveDiagnosticHashes: new Set(),
				trigger: 'onCommand',
			});
		});
	}

	async clearOutputFiles(storageUri: Uri) {
		const outputUri = Uri.joinPath(storageUri, 'noraNodeEngineOutput');

		await this.#fileSystem.delete(outputUri, {
			recursive: true,
			useTrash: false,
		});
	}

	async #bootstrap() {
		if (this.#executableUri) {
			return {
				executableUri: this.#executableUri,
			}
		}

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

		this.#executableUri = executableUri;

		return {
			executableUri,
		};
	}
}
