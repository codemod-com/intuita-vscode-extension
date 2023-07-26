import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import prettyReporter from 'io-ts-reporters';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import * as readline from 'node:readline';
import { commands, FileSystem, Uri, window, workspace } from 'vscode';
import { Case } from '../cases/types';
import { Configuration } from '../configuration';
import { Container } from '../container';
import { buildJobHash } from '../jobs/buildJobHash';
import { Job, JobKind } from '../jobs/types';
import {
	buildTypeCodec,
	isNeitherNullNorUndefined,
	singleQuotify,
	streamToString,
} from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';
import { CodemodHash } from '../packageJsonAnalyzer/types';
import { ExecutionError, executionErrorCodec } from '../errors/types';
import {
	CodemodEntry,
	codemodEntryCodec,
	codemodNamesCodec,
} from '../codemods/types';
import { actions } from '../data/slice';
import { Store } from '../data';
import { buildArguments } from './buildArguments';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as S from '@effect/schema/Schema';
import { createHash } from 'node:crypto';

export class EngineNotFoundError extends Error {}
export class UnableToParseEngineResponseError extends Error {}
export class InvalidEngineResponseFormatError extends Error {}

export const Messages = {
	noAffectedFiles:
		'The codemod has run successfully but didn’t do anything' as const,
	noImportedMod: 'No imported codemod was found' as const,
};

const TERMINATE_IDLE_PROCESS_TIMEOUT = 15 * 1000;

export const enum EngineMessageKind {
	finish = 2,
	rewrite = 3,
	progress = 6,
	delete = 7,
	move = 8,
	create = 9,
	copy = 10,
}

export const messageCodec = t.union([
	buildTypeCodec({
		k: t.literal(EngineMessageKind.rewrite),
		i: t.string,
		o: t.string,
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
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.move),
		oldFilePath: t.string,
		newFilePath: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.create),
		newFilePath: t.string,
		newContentPath: t.string,
	}),
	buildTypeCodec({
		k: t.literal(EngineMessageKind.copy),
		oldFilePath: t.string,
		newFilePath: t.string,
	}),
	buildTypeCodec({
		kind: t.literal('rewrite'),
		oldPath: t.string,
		newDataPath: t.string,
	}),
	buildTypeCodec({
		kind: t.literal('finish'),
	}),
	buildTypeCodec({
		kind: t.literal('progress'),
		processedFileNumber: t.number,
		totalFileNumber: t.number,
	}),
	buildTypeCodec({
		kind: t.literal('delete'),
		oldFilePath: t.string,
	}),
	buildTypeCodec({
		kind: t.literal('move'),
		oldFilePath: t.string,
		newFilePath: t.string,
	}),
	buildTypeCodec({
		kind: t.literal('create'),
		newFilePath: t.string,
		newContentPath: t.string,
	}),
	buildTypeCodec({
		kind: t.literal('copy'),
		oldFilePath: t.string,
		newFilePath: t.string,
	}),
]);

type EngineMessage = t.TypeOf<typeof messageCodec>;

export const verboseEngineMessage = (message: EngineMessage): EngineMessage => {
	if (!('k' in message)) {
		return message;
	}

	if (message.k === EngineMessageKind.rewrite) {
		return {
			kind: 'rewrite',
			oldPath: message.i,
			newDataPath: message.o,
		};
	}

	if (message.k === EngineMessageKind.finish) {
		return {
			kind: 'finish',
		};
	}

	if (message.k === EngineMessageKind.progress) {
		return {
			kind: 'progress',
			processedFileNumber: message.p,
			totalFileNumber: message.t,
		};
	}

	if (message.k === EngineMessageKind.delete) {
		return {
			kind: 'delete',
			oldFilePath: message.oldFilePath,
		};
	}

	if (message.k === EngineMessageKind.move) {
		return {
			kind: 'move',
			oldFilePath: message.oldFilePath,
			newFilePath: message.newFilePath,
		};
	}

	if (message.k === EngineMessageKind.create) {
		return {
			kind: 'create',
			newFilePath: message.newFilePath,
			newContentPath: message.newContentPath,
		};
	}

	return {
		kind: 'copy',
		oldFilePath: message.oldFilePath,
		newFilePath: message.newFilePath,
	};
};

type Execution = {
	readonly childProcess: ChildProcessWithoutNullStreams;
	readonly codemodHash: CodemodHash | null;
	readonly jobs: Job[];
	readonly targetUri: Uri;
	readonly happenedAt: string;
	readonly case: Case;
	totalFileCount: number;
	halted: boolean;
	affectedAnyFile: boolean;
};

type ExecuteCodemodMessage = Message &
	Readonly<{
		kind: MessageKind.executeCodemodSet;
	}>;

export class EngineService {
	readonly #configurationContainer: Container<Configuration>;
	readonly #fileSystem: FileSystem;
	readonly #messageBus: MessageBus;

	#execution: Execution | null = null;
	private __codemodEngineNodeExecutableUri: Uri | null = null;
	private __codemodEngineRustExecutableUri: Uri | null = null;
	private __executionMessageQueue: ExecuteCodemodMessage[] = [];

	public constructor(
		configurationContainer: Container<Configuration>,
		messageBus: MessageBus,
		fileSystem: FileSystem,
		private readonly __store: Store,
	) {
		this.#configurationContainer = configurationContainer;
		this.#messageBus = messageBus;
		this.#fileSystem = fileSystem;

		messageBus.subscribe(MessageKind.engineBootstrapped, (message) =>
			this.#onEnginesBootstrappedMessage(message),
		);

		messageBus.subscribe(MessageKind.executeCodemodSet, (message) => {
			this.#onExecuteCodemodSetMessage(message);
		});
	}

	async #onEnginesBootstrappedMessage(
		message: Message & { kind: MessageKind.engineBootstrapped },
	) {
		this.__codemodEngineNodeExecutableUri =
			message.codemodEngineNodeExecutableUri;
		this.__codemodEngineRustExecutableUri =
			message.codemodEngineRustExecutableUri;

		await this.__syncRegistry();

		await this.__fetchCodemods();
		await this.fetchPrivateCodemods();
	}

	public isEngineBootstrapped() {
		return this.__codemodEngineNodeExecutableUri !== null;
	}

	private async __syncRegistry(): Promise<void> {
		if (this.__codemodEngineNodeExecutableUri === null) {
			throw new Error('The engines are not bootstrapped.');
		}

		const childProcess = spawn(
			singleQuotify(this.__codemodEngineNodeExecutableUri.fsPath),
			['syncRegistry'],
			{
				stdio: 'pipe',
				shell: true,
				detached: false,
			},
		);

		return new Promise<void>((resolve, reject) => {
			childProcess.once('exit', () => {
				resolve();
			});

			childProcess.once('error', (error) => {
				reject(error);
			});
		});
	}

	public async __getCodemodNames(): Promise<ReadonlyArray<string>> {
		const executableUri = this.__codemodEngineNodeExecutableUri;

		if (executableUri === null) {
			throw new EngineNotFoundError(
				'The codemod engine node has not been downloaded yet',
			);
		}

		const childProcess = spawn(
			singleQuotify(executableUri.fsPath),
			['listNames', '--useJson', '--useCache'],
			{
				stdio: 'pipe',
				shell: true,
				detached: false,
			},
		);

		const codemodListJSON = await streamToString(childProcess.stdout);

		try {
			const codemodListOrError = codemodNamesCodec.decode(
				JSON.parse(codemodListJSON),
			);

			if (codemodListOrError._tag === 'Left') {
				const report = prettyReporter.report(codemodListOrError);
				throw new InvalidEngineResponseFormatError(report.join(`\n`));
			}

			return codemodListOrError.right.names;
		} catch (e) {
			if (e instanceof InvalidEngineResponseFormatError) {
				throw e;
			}

			throw new UnableToParseEngineResponseError(
				'Unable to parse engine output',
			);
		}
	}

	private async __fetchCodemods(): Promise<void> {
		try {
			const names = await this.__getCodemodNames();

			const codemodConfigSchema = S.union(
				S.struct({
					schemaVersion: S.literal('1.0.0'),
					engine: S.literal('piranha'),
					language: S.literal('java'),
				}),
				S.struct({
					schemaVersion: S.literal('1.0.0'),
					engine: S.literal('jscodeshift'),
				}),
				S.struct({
					schemaVersion: S.literal('1.0.0'),
					engine: S.literal('ts-morph'),
				}),
				S.struct({
					schemaVersion: S.literal('1.0.0'),
					engine: S.literal('repomod-engine'),
				}),
				S.struct({
					schemaVersion: S.literal('1.0.0'),
					engine: S.literal('recipe'),
					names: S.array(S.string),
				}),
			);

			const codemodEntries: CodemodEntry[] = [];

			for (const name of names) {
				const hashDigest = createHash('ripemd160')
					.update(name)
					.digest('base64url');

				const configPath = join(
					homedir(),
					'.intuita',
					hashDigest,
					'config.json',
				);

				const data = await readFile(configPath, 'utf8');

				const config = S.parseSync(codemodConfigSchema)(
					JSON.parse(data),
				);

				if (config.engine === 'piranha') {
					codemodEntries.push({
						kind: 'piranhaRule',
						hashDigest,
						name,
						language: config.engine,
					});

					continue;
				}

				if (
					config.engine === 'jscodeshift' ||
					config.engine === 'ts-morph' ||
					config.engine === 'repomod-engine' ||
					config.engine === 'recipe'
				) {
					codemodEntries.push({
						kind: 'codemod',
						hashDigest,
						name,
						engine: config.engine,
					});
				}
			}

			this.__store.dispatch(actions.setCodemods(codemodEntries));
		} catch (e) {
			console.error(e);
		}
	}

	public async fetchPrivateCodemods(): Promise<void> {
		try {
			const privateCodemods: CodemodEntry[] = [];
			const globalStoragePath = join(homedir(), '.intuita');
			const privateCodemodNamesPath = join(
				homedir(),
				'.intuita',
				'privateCodemodNames.json',
			);
			if (!existsSync(privateCodemodNamesPath)) {
				return;
			}

			const privateCodemodNamesJSON = await readFile(
				privateCodemodNamesPath,
				{
					encoding: 'utf8',
				},
			);
			const privateCodemodNames = JSON.parse(
				privateCodemodNamesJSON,
			).names;

			const files = await readdir(globalStoragePath);
			for (const file of files) {
				const configPath = join(globalStoragePath, file, 'config.json');

				if (!existsSync(configPath)) {
					continue;
				}
				const data = await readFile(configPath, { encoding: 'utf8' });
				const parsedData = JSON.parse(data);

				const codemodDataOrError = codemodEntryCodec.decode(parsedData);

				if (codemodDataOrError._tag === 'Left') {
					const report = prettyReporter.report(codemodDataOrError);

					console.error(report);
					continue;
				}

				if (
					!privateCodemodNames.includes(codemodDataOrError.right.name)
				) {
					continue;
				}

				privateCodemods.push(codemodDataOrError.right);
			}

			this.__store.dispatch(
				actions.upsertPrivateCodemods(privateCodemods),
			);
		} catch (e) {
			console.error(e);
		}
	}

	public isExecutionInProgress(): boolean {
		return this.#execution !== null;
	}

	shutdownEngines() {
		if (!this.#execution) {
			return;
		}

		this.#execution.halted = true;
		this.#execution.childProcess.stdin.write('shutdown\n');
	}

	private __getQueuedCodemodHashes(): ReadonlyArray<CodemodHash> {
		return this.__executionMessageQueue
			.map(({ command }) =>
				'codemodHash' in command ? command.codemodHash : null,
			)
			.filter(isNeitherNullNorUndefined);
	}

	async #onExecuteCodemodSetMessage(
		message: Message & { kind: MessageKind.executeCodemodSet },
	) {
		if (this.#execution) {
			if (message.command.kind === 'executeCodemod') {
				this.__executionMessageQueue.push(
					message as ExecuteCodemodMessage,
				);

				this.#messageBus.publish({
					kind: MessageKind.executionQueueChange,
					queuedCodemodHashes: this.__getQueuedCodemodHashes(),
				});

				return;
			}

			await window.showErrorMessage(
				'Wait until the previous codemod set execution has finished',
			);
			return;
		}

		if (
			!this.__codemodEngineNodeExecutableUri ||
			!this.__codemodEngineRustExecutableUri
		) {
			await window.showErrorMessage(
				'Wait until the engines has been bootstrapped to execute the operation',
			);

			return;
		}

		const codemodHash =
			message.command.kind === 'executeCodemod' ||
			message.command.kind === 'executeLocalCodemod'
				? message.command.codemodHash
				: null;

		this.#messageBus.publish({
			kind: MessageKind.showProgress,
			codemodHash,
			progressKind: 'infinite',
			value: 0,
		});

		const storageUri = Uri.joinPath(
			message.storageUri,
			'codemod-engine-node',
		);

		await this.#fileSystem.createDirectory(message.storageUri);
		await this.#fileSystem.createDirectory(storageUri);

		const args = buildArguments(
			this.#configurationContainer.get(),
			message,
			storageUri,
		);

		const childProcess = spawn(
			singleQuotify(
				message.command.kind === 'executePiranhaRule'
					? this.__codemodEngineRustExecutableUri.fsPath
					: this.__codemodEngineNodeExecutableUri.fsPath,
			),
			args,
			{
				stdio: 'pipe',
				shell: true,
			},
		);

		this.__store.dispatch(
			actions.setCaseHashInProgress(message.caseHashDigest),
		);

		const executionErrors: ExecutionError[] = [];

		childProcess.stderr.on('data', function (chunk: unknown) {
			if (!(chunk instanceof Buffer)) {
				return;
			}

			console.error(chunk.toString());

			try {
				const stringifiedChunk = JSON.stringify(chunk.toString());

				const json = JSON.parse(stringifiedChunk);

				const validation = executionErrorCodec.decode(json);

				if (E.isLeft(validation)) {
					throw new Error(
						`Could not validate the message error: ${stringifiedChunk}`,
					);
				}

				executionErrors.push(validation.right);
			} catch (error) {
				console.error(error);
			}
		});

		const caseHashDigest = message.caseHashDigest;
		const codemodName = message.command.name;

		this.#execution = {
			childProcess,
			halted: false,
			totalFileCount: 0, // that is the lower bound,
			affectedAnyFile: false,
			jobs: [],
			targetUri: message.targetUri,
			happenedAt: message.happenedAt,
			case: {
				hash: caseHashDigest,
				codemodName: message.command.name,
				createdAt: Number(message.happenedAt),
				path: message.targetUri.fsPath,
			},
			codemodHash:
				'codemodHash' in message.command
					? message.command.codemodHash
					: null,
		};

		const interfase = readline.createInterface(childProcess.stdout);

		let timer: NodeJS.Timeout | null = null;

		interfase.on('line', async (line) => {
			if (timer !== null) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				childProcess.kill();
			}, TERMINATE_IDLE_PROCESS_TIMEOUT);

			if (!this.#execution) {
				return;
			}

			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = verboseEngineMessage(either.right);

			if ('k' in message) {
				return;
			}

			if (message.kind === 'progress') {
				const value =
					message.totalFileNumber > 0
						? Math.round(
								(message.processedFileNumber /
									message.totalFileNumber) *
									100,
						  )
						: 0;

				this.#messageBus.publish({
					kind: MessageKind.showProgress,
					codemodHash: this.#execution.codemodHash ?? null,
					progressKind: 'finite',
					value,
				});
				this.#execution.totalFileCount = message.totalFileNumber;
				return;
			}

			if (message.kind === 'finish') {
				return;
			}

			let job: Job;

			if (message.kind === 'create') {
				const newUri = Uri.file(message.newFilePath);
				const newContentUri = Uri.file(message.newContentPath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.createFile,
					oldUri: null,
					newUri,
					newContentUri,
					codemodName,
					createdAt: Date.now(),
					caseHashDigest,
					modifiedByUser: false,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, caseHashDigest),
				};
			} else if (message.kind === 'rewrite') {
				const oldUri = Uri.file(message.oldPath);
				const newContentUri = Uri.file(message.newDataPath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.rewriteFile,
					oldUri,
					newUri: oldUri,
					newContentUri,
					codemodName,
					createdAt: Date.now(),
					caseHashDigest,
					modifiedByUser: false,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, caseHashDigest),
				};
			} else if (message.kind === 'delete') {
				const oldUri = Uri.file(message.oldFilePath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.deleteFile,
					oldUri,
					newUri: null,
					newContentUri: null,
					codemodName,
					createdAt: Date.now(),
					caseHashDigest,
					modifiedByUser: false,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, caseHashDigest),
				};
			} else if (message.kind === 'move') {
				const oldUri = Uri.file(message.oldFilePath);
				const newUri = Uri.file(message.newFilePath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.moveFile,
					oldUri,
					newUri,
					newContentUri: oldUri,
					codemodName,
					createdAt: Date.now(),
					caseHashDigest,
					modifiedByUser: false,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, caseHashDigest),
				};
			} else if (message.kind === 'copy') {
				const oldUri = Uri.file(message.oldFilePath);
				const newUri = Uri.file(message.newFilePath);

				const hashlessJob: Omit<Job, 'hash'> = {
					kind: JobKind.copyFile,
					oldUri,
					newUri,
					newContentUri: oldUri,
					codemodName,
					createdAt: Date.now(),
					caseHashDigest,
					modifiedByUser: false,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, caseHashDigest),
				};
			} else {
				throw new Error(`Unrecognized message`);
			}

			if (job && !this.#execution.affectedAnyFile) {
				this.#execution.affectedAnyFile = true;
			}

			this.#execution.jobs.push(job);

			this.#messageBus.publish({
				kind: MessageKind.upsertCase,
				kase: this.#execution.case,
				jobs: [job],
			});
		});

		interfase.on('close', async () => {
			if (this.#execution) {
				this.#messageBus.publish({
					kind: MessageKind.codemodSetExecuted,
					halted: this.#execution.halted,
					fileCount: this.#execution.totalFileCount,
					jobs: this.#execution.jobs,
					case: this.#execution.case,
					executionErrors,
				});

				this.__store.dispatch(
					actions.setSelectedCaseHash(this.#execution.case.hash),
				);

				this.__store.dispatch(actions.setCaseHashInProgress(null));

				this.__store.dispatch(
					actions.setExplorerNodes([
						this.#execution.case.hash,
						workspace.workspaceFolders?.[0]?.uri.fsPath ?? '',
					]),
				);

				commands.executeCommand('intuitaMainView.focus');

				if (!this.#execution.affectedAnyFile) {
					window.showWarningMessage(Messages.noAffectedFiles);
				}
			}

			this.#execution = null;

			const nextMessage = this.__executionMessageQueue.shift() ?? null;

			if (nextMessage === null) {
				return;
			}

			this.#onExecuteCodemodSetMessage(nextMessage);

			this.#messageBus.publish({
				kind: MessageKind.executionQueueChange,
				queuedCodemodHashes: this.__getQueuedCodemodHashes(),
			});
		});
	}

	async clearOutputFiles(storageUri: Uri) {
		const outputUri = Uri.joinPath(storageUri, 'codemod-engine-node');

		await this.#fileSystem.delete(outputUri, {
			recursive: true,
			useTrash: false,
		});
	}
}
