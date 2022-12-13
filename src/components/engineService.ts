import * as t from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import { spawn } from 'node:child_process';
import * as readline from 'node:readline';
import { FileSystem, StatusBarItem, Uri, workspace } from 'vscode';
import { buildCaseHash } from '../cases/buildCaseHash';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { buildCreateFileJob } from '../jobs/createFileJob';
import { buildRewriteFileJob } from '../jobs/rewriteFileJob';
import { Job, JobHash } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildHash, buildTypeCodec } from '../utilities';
import { MessageBus, MessageKind } from './messageBus';

export const enum EngineMessageKind {
	change = 1,
	finish = 2,
	rewrite = 3,
	create = 4,
	compare = 5,
}

export const messageCodec = t.union([
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
		k: t.literal(EngineMessageKind.compare),
		i: t.string,
		e: t.boolean,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.finish),
	}),
]);

export abstract class EngineService {
	readonly #caseKind: CaseKind;
	protected readonly fileSystem: FileSystem;
	readonly #messageBus: MessageBus;
	protected readonly statusBarItem: StatusBarItem;
	readonly #storageDirectory: string;

	#executableUri: Uri | null = null;

	public constructor(
		caseKind: CaseKind,
		messageBus: MessageBus,
		fileSystem: FileSystem,
		statusBarItem: StatusBarItem,
		storageDirectory: string,
	) {
		this.#caseKind = caseKind;
		this.#messageBus = messageBus;
		this.fileSystem = fileSystem;
		this.statusBarItem = statusBarItem;
		this.#storageDirectory = storageDirectory;
	}

	protected abstract buildArguments(
		uri: Uri,
		outputUri: Uri,
		group: 'nextJs' | 'mui',
	): ReadonlyArray<string>;
	protected abstract bootstrapExecutableUri(): Promise<Uri>;

	async buildRepairCodeJobs(storageUri: Uri, group: 'nextJs' | 'mui') {
		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		if (!this.#executableUri) {
			this.#executableUri = await this.bootstrapExecutableUri();
		}

		await this.fileSystem.createDirectory(storageUri);

		const outputUri = Uri.joinPath(storageUri, this.#storageDirectory);

		await this.fileSystem.createDirectory(outputUri);

		this.statusBarItem.text = `$(loading~spin) Calculating recommendations`;
		this.statusBarItem.show();

		const childProcess = spawn(
			this.#executableUri.fsPath,
			this.buildArguments(uri, outputUri, group),
			{
				stdio: 'pipe',
			},
		);

		const interfase = readline.createInterface(childProcess.stdout);

		interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (
				message.k === EngineMessageKind.finish ||
				message.k === EngineMessageKind.compare ||
				message.k === EngineMessageKind.change
			) {
				return;
			}

			let job: Job;

			if (message.k === EngineMessageKind.create) {
				const inputUri = Uri.file(message.p);
				const outputUri = Uri.file(message.o);

				job = buildCreateFileJob(inputUri, outputUri, message.c);
			} else {
				const inputUri = Uri.file(message.i);
				const outputUri = Uri.file(message.o);

				job = buildRewriteFileJob(inputUri, outputUri, message.c);
			}

			const subKind = message.c;

			const kase = {
				kind: this.#caseKind,
				subKind,
			} as const;

			const caseWithJobHashes: CaseWithJobHashes = {
				hash: buildCaseHash(kase),
				kind: this.#caseKind,
				subKind,
				jobHashes: new Set([job.hash]),
			};

			this.#messageBus.publish({
				kind: MessageKind.upsertCases,
				casesWithJobHashes: [ caseWithJobHashes ],
				jobs: [ job ],
				inactiveJobHashes: new Set(),
				trigger: 'onCommand',
			});
		});

		interfase.on('close', () => {
			this.statusBarItem.text = '';
			this.statusBarItem.hide();
		});
	}

	async clearOutputFiles(storageUri: Uri) {
		const outputUri = Uri.joinPath(storageUri, this.#storageDirectory);

		await this.fileSystem.delete(outputUri, {
			recursive: true,
			useTrash: false,
		});
	}
}
