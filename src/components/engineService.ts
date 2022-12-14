import * as t from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import { spawn } from 'node:child_process';
import * as readline from 'node:readline';
import { FileSystem, StatusBarItem, Uri, workspace } from 'vscode';
import { CaseKind } from '../cases/types';
import { buildCreateFileJob } from '../jobs/createFileJob';
import { buildRewriteFileJob } from '../jobs/rewriteFileJob';
import { Job } from '../jobs/types';
import { buildTypeCodec } from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';

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

export class EngineService {
	readonly #caseKind: CaseKind;
	protected readonly fileSystem: FileSystem;
	readonly #messageBus: MessageBus;
	protected readonly statusBarItem: StatusBarItem;
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
		this.fileSystem = fileSystem;
		this.statusBarItem = statusBarItem;
		this.#storageDirectory = storageDirectory;

		messageBus.subscribe(message => {
			if (message.kind === MessageKind.executablesBootstrapped) {
				setImmediate(
					async () => {
						await this.#onExecutablesBootstrappedMessage(message);
					}
				)
			}
		})
	}

	async #onExecutablesBootstrappedMessage(message: Message & { kind: MessageKind.executablesBootstrapped }) {
		const executableUri = message.command.engine === 'node'
			? message.noraNodeEngineExecutableUri
			: message.noraRustEngineExecutableUri;

		await this.#buildRepairCodeJobs(
			executableUri,
			message.command.group,
			message.command.storageUri,
		);
	}

	async #buildRepairCodeJobs(
		executableUri: Uri,
		group: 'nextJs' | 'mui',
		storageUri: Uri,
	) {
		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		await this.fileSystem.createDirectory(storageUri);

		const outputUri = Uri.joinPath(storageUri, this.#storageDirectory);

		await this.fileSystem.createDirectory(outputUri);

		this.statusBarItem.text = `$(loading~spin) Calculating recommendations`;
		this.statusBarItem.show();

		const childProcess = spawn(
			executableUri.fsPath,
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

			this.#messageBus.publish({
				kind: MessageKind.compareFiles,
				job,
				caseKind: this.#caseKind,
				caseSubKind: message.c,
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
