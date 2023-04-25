import * as t from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import * as readline from 'node:readline';
import { FileSystem, Uri, window } from 'vscode';
import { CaseKind } from '../cases/types';
import { Configuration } from '../configuration';
import { Container } from '../container';
import { buildJobHash } from '../jobs/buildJobHash';
import { Job, JobKind } from '../jobs/types';
import { buildTypeCodec, singleQuotify } from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';
import { StatusBarItemManager } from './statusBarItemManager';

export class EngineNotFoundError extends Error {}
export class UnableToParseEngineResponseError extends Error {}

export const Messages = {
	noAffectedFiles: 'The codemod has run successfully but didn’t do anything',
	noImportedMod: 'No imported codemod was found',
	errorRunningCodemod: 'An error occurred while running the codemod',
	codemodUnrecognized: 'The codemod is invalid / unsupported',
};

export const enum EngineMessageKind {
	change = 1,
	finish = 2,
	rewrite = 3,
	compare = 5,
	progress = 6,
	delete = 7,
	move = 8,
	create = 9,
	copy = 10,
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
		oldDataPath: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.compare),
		i: t.string,
		e: t.boolean,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.finish),
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.progress),
		p: t.number,
		t: t.number,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.delete),
		oldFilePath: t.string,
		modId: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.move),
		oldFilePath: t.string,
		newFilePath: t.string,
		modId: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.create),
		newFilePath: t.string,
		newContentPath: t.string,
		modId: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.copy),
		oldFilePath: t.string,
		newFilePath: t.string,
		modId: t.string,
	}),
]);

const STORAGE_DIRECTORY_MAP = new Map([
	['node', 'nora-node-engine'],
	['rust', 'nora-rust-engine'],
]);

type Execution = {
	readonly executionId: string;
	readonly childProcess: ChildProcessWithoutNullStreams;
	readonly codemodSetName: string;
	totalFileCount: number;
	halted: boolean;
	affectedAnyFile: boolean;
};

const codemodEntryCodec = buildTypeCodec({
	kind: t.literal('codemod'),
	hashDigest: t.string,
	name: t.string,
	description: t.string,
});

type CodemodEntry = t.TypeOf<typeof codemodEntryCodec>;

const codemodListCodec = t.readonlyArray(codemodEntryCodec);

export class EngineService {
	readonly #configurationContainer: Container<Configuration>;
	readonly #fileSystem: FileSystem;
	readonly #messageBus: MessageBus;
	readonly #statusBarItemManager: StatusBarItemManager;

	#execution: Execution | null = null;
	#noraNodeEngineExecutableUri: Uri | null = null;
	#noraRustEngineExecutableUri: Uri | null = null;

	public constructor(
		configurationContainer: Container<Configuration>,
		messageBus: MessageBus,
		fileSystem: FileSystem,
		statusBarItemManager: StatusBarItemManager,
	) {
		this.#configurationContainer = configurationContainer;
		this.#messageBus = messageBus;
		this.#fileSystem = fileSystem;
		this.#statusBarItemManager = statusBarItemManager;

		messageBus.subscribe(MessageKind.enginesBootstrapped, (message) =>
			this.#onEnginesBootstrappedMessage(message),
		);

		messageBus.subscribe(MessageKind.executeCodemodSet, (message) => {
			this.#onExecuteCodemodSetMessage(message);
		});

		messageBus.subscribe(MessageKind.filesCompared, (message) => {
			this.#onFilesComparedMessage(message);
		});
	}

	async #onEnginesBootstrappedMessage(
		message: Message & { kind: MessageKind.enginesBootstrapped },
	) {
		this.#noraNodeEngineExecutableUri = message.noraNodeEngineExecutableUri;
		this.#noraRustEngineExecutableUri = message.noraRustEngineExecutableUri;
		const res = await this.getCodemodList();
		console.log(res);
	}

	public async getCodemodList(): Promise<Readonly<CodemodEntry[]>> {
		const executableUri = this.#noraNodeEngineExecutableUri;

		if (!executableUri) {
			throw new EngineNotFoundError(
				'The codemod engine node has not been downloaded yet',
			);
		}

		const childProcess = spawn(
			singleQuotify(executableUri.fsPath),
			['list'],
			{
				stdio: 'pipe',
				shell: true,
			},
		);

		return new Promise<Readonly<CodemodEntry[]>>((resolve, reject) => {
			let codemodListJSON = '';

			childProcess.stderr.on('data', function (error: unknown) {
				reject(new Error(String(error)));
			});

			childProcess.stdout.on('data', async (data: unknown) => {
				if (!(data instanceof Buffer)) {
					return;
				}

				codemodListJSON += data.toString();
			});

			childProcess.stdout.on('end', async () => {
				try {
					const codemodListOrError = codemodListCodec.decode(
						JSON.parse(codemodListJSON),
					);

					if (codemodListOrError._tag === 'Left') {
						const report =
							prettyReporter.report(codemodListOrError);
						throw new UnableToParseEngineResponseError(
							report.join(`\n`),
						);
					}

					resolve(codemodListOrError.right);
				} catch (e) {
					reject(e);
				}
			});
		});
	}

	shutdownEngines() {
		if (!this.#execution) {
			return;
		}

		this.#execution.halted = true;
		this.#execution.childProcess.stdin.write('shutdown\n');
	}

	async #onExecuteCodemodSetMessage(
		message: Message & { kind: MessageKind.executeCodemodSet },
	) {
		if (this.#execution) {
			await window.showErrorMessage(
				'Wait until the previous codemod set execution has finished',
			);

			return;
		}

		if (
			!this.#noraNodeEngineExecutableUri ||
			!this.#noraRustEngineExecutableUri
		) {
			await window.showErrorMessage(
				'Wait until the engines have been bootstrapped to execute the operation',
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
				? this.#noraNodeEngineExecutableUri
				: this.#noraRustEngineExecutableUri;

		await this.#fileSystem.createDirectory(storageUri);
		await this.#fileSystem.createDirectory(outputUri);

		const { fileLimit, includePatterns, excludePatterns } =
			this.#configurationContainer.get();

		const buildArguments = () => {
			const args: string[] = [];

			if ('kind' in message.command) {
				args.push('repomod');
				args.push('-f', singleQuotify(message.command.repomodFilePath));
				args.push(
					'-i',
					singleQuotify(message.command.inputPath.fsPath),
				);
				args.push(
					'-o',
					singleQuotify(message.command.storageUri.fsPath),
				);

				return args;
			}

			if (message.command.engine === 'node') {
				const commandUri = message.command.uri;

				includePatterns.forEach((includePattern) => {
					const { fsPath } = Uri.joinPath(commandUri, includePattern);

					const path = singleQuotify(fsPath);

					args.push('-p', path);
				});
				excludePatterns.forEach((excludePattern) => {
					const { fsPath } = Uri.joinPath(commandUri, excludePattern);

					const path = singleQuotify(fsPath);

					args.push('-p', `!${path}`);
				});
				args.push(
					'-w',
					String(
						this.#configurationContainer.get().workerThreadCount,
					),
				);

				args.push('-l', String(fileLimit));
			} else if (message.command.engine === 'rust') {
				const commandUri = message.command.uri;

				args.push('-d', singleQuotify(commandUri.fsPath));

				['js', 'jsx', 'ts', 'tsx'].forEach((extension) => {
					const { fsPath } = Uri.joinPath(
						commandUri,
						`**/*.${extension}`,
					);

					const path = singleQuotify(fsPath);

					args.push('-p', path);
				});

				args.push('-a', '**/node_modules/**/*');
			}

			if ('fileUri' in message.command) {
				args.push('-f', singleQuotify(message.command.fileUri.fsPath));

				const { fsPath } = Uri.joinPath(
					message.command.uri,
					`**/*.{js,jsx,ts,tsx}`,
				);

				args.push('-p', fsPath);
				args.push('-p', '!**/node_modules');
			}

			if ('recipeName' in message.command) {
				args.push('-g', message.command.recipeName);
			}

			args.push('-o', singleQuotify(outputUri.fsPath));

			return args;
		};

		const args = buildArguments();

		const caseKind =
			message.command.engine === 'node'
				? CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE
				: CaseKind.REWRITE_FILE_BY_NORA_RUST_ENGINE;

		const childProcess = spawn(singleQuotify(executableUri.fsPath), args, {
			stdio: 'pipe',
			shell: true,
		});

		const errorMessages = new Set<string>();

		childProcess.stderr.on('data', function (err: unknown) {
			if (!(err instanceof Buffer)) return;
			try {
				const error = err.toString();
				errorMessages.add(error);
			} catch (err) {
				console.error(err);
			}
		});

		const executionId = message.executionId;

		const codemodSetName =
			'recipeName' in message.command ? message.command.recipeName : '';

		this.#execution = {
			childProcess,
			executionId,
			codemodSetName,
			halted: false,
			totalFileCount: 0, // that is the lower bound,
			affectedAnyFile: false,
		};

		const interfase = readline.createInterface(childProcess.stdout);

		const noraRustEngineExecutableUri = this.#noraRustEngineExecutableUri;

		interfase.on('line', async (line) => {
			if (!this.#execution) {
				return;
			}

			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === EngineMessageKind.progress) {
				this.#statusBarItemManager.moveToProgress(message.p, message.t);
				this.#messageBus.publish({
					kind: MessageKind.showProgress,
					totalFiles: message.t,
					processedFiles: message.p,
				});
				this.#execution.totalFileCount = message.t;
				return;
			}

			if (
				message.k === EngineMessageKind.finish ||
				message.k === EngineMessageKind.compare ||
				message.k === EngineMessageKind.change
			) {
				return;
			}

			let job: Job;

			const codemodName = 'modId' in message ? message.modId : message.c;

			if (message.k === EngineMessageKind.create) {
				const newUri = Uri.file(message.newFilePath);
				const newContentUri = Uri.file(message.newContentPath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.createFile,
					oldUri: null,
					newUri,
					oldContentUri: null,
					newContentUri,
					codemodSetName,
					codemodName,
					createdAt: Date.now(),
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob),
				};
			} else if (message.k === EngineMessageKind.rewrite) {
				const oldUri = Uri.file(message.i);
				const oldContentUri = Uri.file(message.oldDataPath);
				const newContentUri = Uri.file(message.o);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.rewriteFile,
					oldUri,
					newUri: oldUri,
					newContentUri,
					oldContentUri,
					codemodSetName,
					codemodName,
					createdAt: Date.now(),
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob),
				};
			} else if (message.k === EngineMessageKind.delete) {
				const oldUri = Uri.file(message.oldFilePath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.deleteFile,
					oldUri,
					newUri: null,
					newContentUri: null,
					oldContentUri: oldUri,
					codemodSetName,
					codemodName,
					createdAt: Date.now(),
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob),
				};
			} else if (message.k === EngineMessageKind.move) {
				const oldUri = Uri.file(message.oldFilePath);
				const newUri = Uri.file(message.newFilePath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.moveFile,
					oldUri,
					newUri,
					newContentUri: oldUri,
					oldContentUri: oldUri,
					codemodSetName,
					codemodName,
					createdAt: Date.now(),
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob),
				};
			} else if (message.k === EngineMessageKind.copy) {
				const oldUri = Uri.file(message.oldFilePath);
				const newUri = Uri.file(message.newFilePath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.copyFile,
					oldUri,
					newUri,
					newContentUri: oldUri,
					oldContentUri: oldUri,
					codemodSetName,
					codemodName,
					createdAt: Date.now(),
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob),
				};
			} else {
				throw new Error(`Unrecognized message`);
			}

			if (job && !this.#execution.affectedAnyFile) {
				this.#execution.affectedAnyFile = true;
			}

			this.#messageBus.publish({
				kind: MessageKind.compareFiles,
				noraRustEngineExecutableUri,
				job,
				caseKind,
				caseSubKind: codemodName,
				executionId,
				codemodSetName,
				codemodName,
			});
		});

		interfase.on('close', () => {
			this.#statusBarItemManager.moveToStandby();

			if (this.#execution) {
				this.#messageBus.publish({
					kind: MessageKind.codemodSetExecuted,
					executionId: this.#execution.executionId,
					codemodSetName: this.#execution.codemodSetName,
					halted: this.#execution.halted,
					fileCount: this.#execution.totalFileCount,
				});

				if (!errorMessages.size && !this.#execution.affectedAnyFile) {
					window.showWarningMessage(Messages.noAffectedFiles);
				}

				errorMessages.forEach((error) => {
					try {
						const parsedError = JSON.parse(error);
						window.showErrorMessage(
							`${
								'kind' in parsedError &&
								parsedError.kind === 'unrecognizedCodemod'
									? Messages.codemodUnrecognized
									: Messages.errorRunningCodemod
							}. Error: ${error}`,
						);
					} catch (err) {
						window.showErrorMessage(`Error: ${error}`);
						console.error(err);
					}
				});
			}

			this.#execution = null;
		});
	}

	async #onFilesComparedMessage(
		message: Message & { kind: MessageKind.filesCompared },
	) {
		if (
			!this.#execution ||
			this.#execution.executionId !== message.executionId
		) {
			return;
		}

		this.#execution.affectedAnyFile = true;
	}

	async clearOutputFiles(storageUri: Uri) {
		for (const storageDirectory of STORAGE_DIRECTORY_MAP.values()) {
			const outputUri = Uri.joinPath(storageUri, storageDirectory);

			await this.#fileSystem.delete(outputUri, {
				recursive: true,
				useTrash: false,
			});
		}
	}
}
