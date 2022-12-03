import { spawn } from 'child_process';
import * as t from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import * as readline from 'node:readline';
import { FileSystem, Uri, workspace } from 'vscode';
import { buildCaseHash } from '../cases/buildCaseHash';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { buildRewriteFileJob } from '../features/rewriteFile/job';
import { Job, JobHash } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildHash, buildTypeCodec } from "../utilities";
import { MessageBus, MessageKind } from './messageBus';

const enum NoraRustEngineMessageKind {
	finish = 2,
	create = 4,
}

const messageCodec = t.union([
    buildTypeCodec({
        k: t.literal(NoraRustEngineMessageKind.create),
        p: t.string,
        o: t.string,
        c: t.string,
    }),
    buildTypeCodec({
        k: t.literal(NoraRustEngineMessageKind.finish),
    })
]);

export class NodaRustEngineService {
    readonly #fileSystem: FileSystem;
    readonly #messageBus: MessageBus;

    #executableUri: Uri | null = null;

    public constructor(
        fileSystem: FileSystem,
        messageBus: MessageBus,
    ) {
        this.#fileSystem = fileSystem;
        this.#messageBus = messageBus;
    }

    async buildRepairCodeJobs(storageUri: Uri, group: 'nextJs') {
		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		const { executableUri } = await this.#bootstrap();

		await this.#fileSystem.createDirectory(storageUri);

		const outputUri = Uri.joinPath(storageUri, 'noraRustEngineOutput');

		await this.#fileSystem.createDirectory(outputUri);

        const pattern = Uri.joinPath(uri, '**/*.tsx').fsPath;

        const childProcess = spawn(
			executableUri.fsPath,
			[
                '-d',
                uri.fsPath,
				'-p',
				pattern,
				'-a',
				'!**/node_modules',
				'-g',
				group,
				'-o',
				outputUri.fsPath,
			],
			{
				stdio: 'pipe',
			},
		);

        const interfase = readline.createInterface(childProcess.stdout);

		const jobMap = new Map<JobHash, Job>();
		const codemodIdHashJobHashMap = new LeftRightHashSetManager<
			string,
			JobHash
		>(new Set());

		const codemodIdSubKindMap = new Map<string, string>();

        interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === NoraRustEngineMessageKind.create) {
				const inputUri = Uri.file(message.p);
				const outputUri = Uri.file(message.o);

				const job = buildRewriteFileJob(inputUri, outputUri, message.c);

				jobMap.set(job.hash, job);
				codemodIdHashJobHashMap.upsert(buildHash(message.c), job.hash);
				codemodIdSubKindMap.set(buildHash(message.c), message.c);
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
				const subKind = codemodIdSubKindMap.get(codemodIdHash) ?? '';

				const kase = {
					kind,
					subKind,
				} as const;

				const caseWithJobHashes: CaseWithJobHashes = {
					hash: buildCaseHash(kase),
					kind,
					subKind,
					jobHashes,
				};

				casesWithJobHashes.push(caseWithJobHashes);
			});

			const jobs = Array.from(jobMap.values());

			this.#messageBus.publish({
				kind: MessageKind.upsertCases,
				casesWithJobHashes,
				jobs,
				inactiveJobHashes: new Set(),
				trigger: 'onCommand',
			});
		});
    }

    async clearOutputFiles(storageUri: Uri) {
		const outputUri = Uri.joinPath(storageUri, 'noraRustEngineOutput');

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

        const executableUri = Uri.file("/intuita/nora-rust-engine/target/release/nora-rust-engine");

        this.#executableUri = executableUri;

		return {
			executableUri,
		};
	}
}

