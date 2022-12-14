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

const STORAGE_DIRECTORY_MAP = new Map([
	['node', 'nora-node-engine'],
	['rust', 'nora-rust-engine'],
]);

export class EngineService {
	protected readonly fileSystem: FileSystem;
	readonly #messageBus: MessageBus;
	protected readonly statusBarItem: StatusBarItem;

	public constructor(
		messageBus: MessageBus,
		fileSystem: FileSystem,
		statusBarItem: StatusBarItem,
	) {
		this.#messageBus = messageBus;
		this.fileSystem = fileSystem;
		this.statusBarItem = statusBarItem;

		messageBus.subscribe((message) => {
			if (message.kind === MessageKind.executablesBootstrapped) {
				setImmediate(async () => {
					await this.#onExecutablesBootstrappedMessage(message);
				});
			}
		});
	}

	async #onExecutablesBootstrappedMessage(
		message: Message & { kind: MessageKind.executablesBootstrapped },
	) {
		const { noraRustEngineExecutableUri } = message;
		const uri = workspace.workspaceFolders?.[0]?.uri;

		if (!uri) {
			console.warn(
				'No workspace folder is opened, aborting the operation.',
			);
			return;
		}

		const { storageUri } = message.command;

		const storageDirectory =
			message.command.engine === 'node'
				? 'nora-node-engine'
				: 'nora-rust-engine';

		const outputUri = Uri.joinPath(
			message.command.storageUri,
			storageDirectory,
		);

		const executableUri =
			message.command.engine === 'node'
				? message.noraNodeEngineExecutableUri
				: message.noraRustEngineExecutableUri;

		await this.fileSystem.createDirectory(storageUri);
		await this.fileSystem.createDirectory(outputUri);

		this.statusBarItem.text = `$(loading~spin) Calculating recommendations`;
		this.statusBarItem.show();

		const args: ReadonlyArray<string> =
			message.command.engine === 'node'
				? [
						'-p',
						Uri.joinPath(uri, '**/*.tsx').fsPath,
						'-p',
						'!**/node_modules',
						'-g',
						message.command.group,
						'-l',
						'100',
						'-o',
						outputUri.fsPath,
				  ]
				: [
						'-d',
						uri.fsPath,
						'-p',
						`"${Uri.joinPath(uri, '**/*.tsx').fsPath}"`,
						'-a',
						'**/node_modules/**/*',
						'-g',
						message.command.group,
						'-o',
						outputUri.fsPath,
				  ];

		const caseKind =
			message.command.engine === 'node'
				? CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE
				: CaseKind.REWRITE_FILE_BY_NORA_RUST_ENGINE;

		const childProcess = spawn(executableUri.fsPath, args, {
			stdio: 'pipe',
		});

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
				noraRustEngineExecutableUri,
				job,
				caseKind,
				caseSubKind: message.c,
			});
		});

		interfase.on('close', () => {
			this.statusBarItem.text = '';
			this.statusBarItem.hide();
		});
	}

	async clearOutputFiles(storageUri: Uri) {
		for (const storageDirectory of STORAGE_DIRECTORY_MAP.values()) {
			const outputUri = Uri.joinPath(storageUri, storageDirectory);

			await this.fileSystem.delete(outputUri, {
				recursive: true,
				useTrash: false,
			});
		}
	}
}
