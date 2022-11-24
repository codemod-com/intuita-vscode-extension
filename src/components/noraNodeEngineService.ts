import * as t from 'io-ts';
import { FileSystem, Uri, workspace } from 'vscode';
import { spawn } from 'child_process';
import * as readline from 'node:readline';
import { buildTypeCodec, ReplacementEnvelope } from './inferenceService';
import prettyReporter from 'io-ts-reporters';
import { buildFile } from '../files/buildFile';
import { UriHash } from '../uris/types';
import { File } from '../files/types';
import { Job, JobHash } from '../jobs/types';
import { buildUriHash } from '../uris/buildUriHash';
import { buildRepairCodeJob } from '../features/repairCode/job';
import {
	CaseKind,
	CaseWithJobHashes,
	RewriteFileByNoraNodeEngineCaseSubKind,
} from '../cases/types';
import { buildCaseHash } from '../cases/buildCaseHash';
import { MessageBus, MessageKind } from './messageBus';
import { buildRewriteFileJob } from '../features/rewriteFile/job';
import { DownloadService, ForbiddenRequestError } from './downloadService';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildHash } from '../utilities';

const enum NoraNodeEngineMessageKind {
	change = 1,
	finish = 2,
	rewrite = 3,
}

const codemodIdSubKindMap = new Map([
	[
		buildHash('nextJsAddMissingReactImport'),
		RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_REACT_IMPORT,
	],
	[
		buildHash('nextJsImageExperimental'),
		RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_IMAGE,
	],
	[
		buildHash('nextJsNewLink'),
		RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_LINK,
	],
]);

const messageCodec = t.union([
	buildTypeCodec({
		k: t.literal(NoraNodeEngineMessageKind.change),
		p: t.string,
		r: t.tuple([t.number, t.number]),
		t: t.string,
		c: t.string,
	}),
	buildTypeCodec({
		k: t.literal(NoraNodeEngineMessageKind.finish),
	}),
	buildTypeCodec({
		k: t.literal(NoraNodeEngineMessageKind.rewrite),
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
			[
				'-p',
				pattern,
				'-p',
				'!**/node_modules',
				'-g',
				'nextJs',
				'-o',
				outputUri.fsPath,
			],
			{
				stdio: 'pipe',
			},
		);

		const interfase = readline.createInterface(childProcess.stdout);

		const uriHashFileMap = new Map<UriHash, File>();
		const jobMap = new Map<JobHash, Job>();
		const codemodIdHashJobHashMap = new LeftRightHashSetManager<
			string,
			JobHash
		>(new Set());

		interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === NoraNodeEngineMessageKind.change) {
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

				jobMap.set(job.hash, job);
				codemodIdHashJobHashMap.upsert(buildHash(message.c), job.hash);
			} else if (message.k === NoraNodeEngineMessageKind.rewrite) {
				const inputUri = Uri.file(message.i);
				const outputUri = Uri.file(message.o);

				const job = buildRewriteFileJob(inputUri, outputUri, message.c);

				jobMap.set(job.hash, job);
				codemodIdHashJobHashMap.upsert(buildHash(message.c), job.hash);
			}
		});

		interfase.on('close', () => {
			const casesWithJobHashes: CaseWithJobHashes[] = [];

			codemodIdHashJobHashMap.getLeftHashes().forEach((codemodIdHash) => {
				const jobs: Job[] = [];

				const jobHashes =
					codemodIdHashJobHashMap.getRightHashesByLeftHash(
						codemodIdHash,
					);

				jobHashes.forEach((jobHash) => {
					const job = jobMap.get(jobHash);

					if (job) {
						jobs.push(job);
					}
				});

				if (!jobs[0]) {
					return;
				}

				const kind = CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE;
				const subKind =
					codemodIdSubKindMap.get(codemodIdHash) ??
					RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_IMAGE;

				const kase = {
					kind,
					subKind,
				} as const;

				const caseWithJobHashes: CaseWithJobHashes = {
					hash: buildCaseHash(kase, jobs[0].hash),
					kind,
					subKind,
					jobHashes,
				};

				casesWithJobHashes.push(caseWithJobHashes);
			});

			const jobs = Array.from(jobMap.values());

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
			};
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
