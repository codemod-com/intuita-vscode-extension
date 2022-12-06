import * as t from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import { spawn } from 'node:child_process';
import * as readline from 'node:readline';
import { FileSystem, StatusBarItem, Uri, workspace } from "vscode";
import { buildCaseHash } from '../cases/buildCaseHash';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { buildCreateFileJob } from '../jobs/createFileJob';
import { Job, JobHash } from "../jobs/types";
import { LeftRightHashSetManager } from "../leftRightHashes/leftRightHashSetManager";
import { buildHash, buildTypeCodec } from '../utilities';
import { MessageBus, MessageKind } from "./messageBus";

const enum EngineMessageKind {
	change = 1,
	finish = 2,
	rewrite = 3,
    create = 4,
}

const messageCodec = t.union([
    buildTypeCodec({
		k: t.literal(EngineMessageKind.change),
		p: t.string,
		r: t.tuple([t.number, t.number]),
		t: t.string,
		c: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.rewrite),
		i: t.string,
		o: t.string,
		c: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.create),
		p: t.string,
		o: t.string,
		c: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.finish),
	}),
]);

export abstract class EngineService {
    readonly #caseKind: CaseKind;
    readonly #fileSystem: FileSystem;
	readonly #messageBus: MessageBus;
	readonly #statusBarItem: StatusBarItem;
    readonly #storageDirectory: string;
    
    public constructor(
        caseKind: CaseKind,
		messageBus: MessageBus,
		fileSystem: FileSystem,
		statusBarItem: StatusBarItem,
        storageDirectory: string,
	) {
        this.#caseKind = caseKind;
		this.#messageBus = messageBus;
		this.#fileSystem = fileSystem;
		this.#statusBarItem = statusBarItem;
        this.#storageDirectory = storageDirectory;
	}

    protected abstract buildArguments(): ReadonlyArray<string>;
    protected abstract bootstrapExecutableUri(): Promise<Uri>;

    async buildRepairCodeJobs(storageUri: Uri, group: 'nextJs' | 'mui') {
		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		const executableUri = await this.bootstrapExecutableUri();

		await this.#fileSystem.createDirectory(storageUri);

		const outputUri = Uri.joinPath(storageUri, this.#storageDirectory);

		await this.#fileSystem.createDirectory(outputUri);

		const pattern = Uri.joinPath(uri, '**/*.tsx').fsPath;

		this.#showStatusBarItemText(0);

        // TODO fix the argument creation
		const childProcess = spawn(
			executableUri.fsPath,
			[
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

			if (message.k === EngineMessageKind.create) {
				const inputUri = Uri.file(message.p);
				const outputUri = Uri.file(message.o);

				const job = buildCreateFileJob(inputUri, outputUri, message.c);

				jobMap.set(job.hash, job);
				codemodIdHashJobHashMap.upsert(buildHash(message.c), job.hash);
				codemodIdSubKindMap.set(buildHash(message.c), message.c);

				this.#showStatusBarItemText(jobMap.size);
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

				const subKind = codemodIdSubKindMap.get(codemodIdHash) ?? '';

				const kase = {
					kind: this.#caseKind,
					subKind,
				} as const;

				const caseWithJobHashes: CaseWithJobHashes = {
					hash: buildCaseHash(kase),
					kind: this.#caseKind,
					subKind,
					jobHashes,
				};

				casesWithJobHashes.push(caseWithJobHashes);
			});

			const jobs = Array.from(jobMap.values());

			this.#showStatusBarItemText(0);

			this.#messageBus.publish({
				kind: MessageKind.upsertCases,
				casesWithJobHashes,
				jobs,
				inactiveJobHashes: new Set(),
				trigger: 'onCommand',
			});

			this.#statusBarItem.hide();
		});
	}

    #showStatusBarItemText(numberOfJobs: number) {
		const ending = numberOfJobs === 1 ? '' : 's';

		this.#statusBarItem.text = `$(loading~spin) Calculated ${numberOfJobs} recommendation${ending} so far`;
		this.#statusBarItem.show();
	}
}