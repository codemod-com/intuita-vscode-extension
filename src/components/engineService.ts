import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import prettyReporter from 'io-ts-reporters';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import * as readline from 'node:readline';
import { FileSystem, Uri, window } from 'vscode';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { Configuration } from '../configuration';
import { Container } from '../container';
import { buildJobHash } from '../jobs/buildJobHash';
import { Job, JobKind } from '../jobs/types';
import {
	buildTypeCodec,
	doubleQuotify,
	singleQuotify,
	streamToString,
} from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';
import { CodemodHash } from '../packageJsonAnalyzer/types';
import { buildCaseHash } from '../cases/buildCaseHash';
import { ExecutionError, executionErrorCodec } from '../errors/types';
import { WorkspaceState } from '../persistedState/workspaceState';
import { CodemodEntry, codemodEntryCodec } from '../codemods/types';
import { actions } from '../data/slice';
import { Store } from '../data';

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

type Execution = {
	readonly executionId: string;
	readonly childProcess: ChildProcessWithoutNullStreams;
	readonly codemodSetName: string;
	readonly codemodHash?: CodemodHash;
	totalFileCount: number;
	halted: boolean;
	affectedAnyFile: boolean;
	readonly jobs: Job[];
	case: CaseWithJobHashes;
};

export class EngineService {
	readonly #configurationContainer: Container<Configuration>;
	readonly #fileSystem: FileSystem;
	readonly #messageBus: MessageBus;

	#execution: Execution | null = null;
	#noraNodeEngineExecutableUri: Uri | null = null;

	public constructor(
		configurationContainer: Container<Configuration>,
		messageBus: MessageBus,
		fileSystem: FileSystem,
		private readonly __workspaceState: WorkspaceState,
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

	#onEnginesBootstrappedMessage(
		message: Message & { kind: MessageKind.engineBootstrapped },
	) {
		this.#noraNodeEngineExecutableUri = message.noraNodeEngineExecutableUri;
	}

	public isEngineBootstrapped() {
		return this.#noraNodeEngineExecutableUri !== null;
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
				detached: false,
			},
		);

		const codemodListJSON = await streamToString(childProcess.stdout);

		try {
			const codemodListOrError = t
				.readonlyArray(codemodEntryCodec)
				.decode(JSON.parse(codemodListJSON));

			if (codemodListOrError._tag === 'Left') {
				const report = prettyReporter.report(codemodListOrError);
				throw new InvalidEngineResponseFormatError(report.join(`\n`));
			}

			return codemodListOrError.right;
		} catch (e) {
			if (e instanceof InvalidEngineResponseFormatError) {
				throw e;
			}

			throw new UnableToParseEngineResponseError(
				'Unable to parse engine output',
			);
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

	async #onExecuteCodemodSetMessage(
		message: Message & { kind: MessageKind.executeCodemodSet },
	) {
		if (this.#execution) {
			await window.showErrorMessage(
				'Wait until the previous codemod set execution has finished',
			);

			return;
		}

		if (!this.#noraNodeEngineExecutableUri) {
			await window.showErrorMessage(
				'Wait until the engine has been bootstrapped to execute the operation',
			);

			return;
		}

		const { storageUri } = message.command;

		const outputUri = Uri.joinPath(
			message.command.storageUri,
			'nora-node-engine',
		);

		await this.#fileSystem.createDirectory(storageUri);
		await this.#fileSystem.createDirectory(outputUri);

		const { fileLimit, includePatterns, excludePatterns } =
			this.#configurationContainer.get();

		const buildArguments = () => {
			const args: string[] = [];

			if (
				'kind' in message.command &&
				message.command.kind === 'repomod'
			) {
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

			if (
				'kind' in message.command &&
				message.command.kind === 'executeCodemod'
			) {
				args.push(
					'-c',
					singleQuotify(doubleQuotify(message.command.codemodHash)),
				);

				const commandUri = message.command.uri;
				const { directory } = message.command;

				if (directory) {
					includePatterns.forEach((includePattern) => {
						const { fsPath } = Uri.joinPath(
							commandUri,
							includePattern,
						);

						const path = singleQuotify(fsPath);

						args.push('-p', path);
					});

					excludePatterns.forEach((excludePattern) => {
						const { fsPath } = Uri.joinPath(
							commandUri,
							excludePattern,
						);

						const path = singleQuotify(fsPath);

						args.push('-p', `!${path}`);
					});
				} else {
					const path = singleQuotify(commandUri.fsPath);

					args.push('-p', path);
				}

				args.push(
					'-w',
					String(
						this.#configurationContainer.get().workerThreadCount,
					),
				);

				args.push('-l', String(fileLimit));

				args.push(
					'-o',
					singleQuotify(message.command.storageUri.fsPath),
				);

				return args;
			}

			const commandUri = message.command.uri;
			const { directory } = message.command;

			if (directory) {
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
			} else {
				const path = singleQuotify(commandUri.fsPath);

				args.push('-p', path);
			}

			args.push(
				'-w',
				String(this.#configurationContainer.get().workerThreadCount),
			);

			args.push('-l', String(fileLimit));

			if ('fileUri' in message.command) {
				args.push('-f', singleQuotify(message.command.fileUri.fsPath));

				const { fsPath } = Uri.joinPath(
					message.command.uri,
					`**/*.{js,jsx,ts,tsx}`,
				);

				args.push('-p', fsPath);
				args.push('-p', '!**/node_modules');
			}

			args.push('-o', singleQuotify(outputUri.fsPath));

			return args;
		};

		const args = buildArguments();

		const caseKind = CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE;

		const childProcess = spawn(
			singleQuotify(this.#noraNodeEngineExecutableUri.fsPath),
			args,
			{
				stdio: 'pipe',
				shell: true,
			},
		);

		const executionErrors: ExecutionError[] = [];

		childProcess.stderr.on('data', function (chunk: unknown) {
			if (!(chunk instanceof Buffer)) {
				return;
			}

			try {
				const stringifiedChunk = chunk.toString();
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

		const executionId = message.executionId;

		// TODO remove the codemod set name
		const codemodSetName = '';

		this.#execution = {
			childProcess,
			executionId,
			codemodSetName,
			halted: false,
			totalFileCount: 0, // that is the lower bound,
			affectedAnyFile: false,
			jobs: [],
			case: {} as CaseWithJobHashes,
		};
		if (
			'kind' in message.command &&
			message.command.kind === 'executeCodemod'
		) {
			this.#execution = {
				...this.#execution,
				codemodHash: message.command.codemodHash,
			};
		}

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

			const message = either.right;

			if (message.k === EngineMessageKind.progress) {
				this.#messageBus.publish({
					kind: MessageKind.showProgress,
					totalFiles: message.t,
					processedFiles: message.p,
					codemodHash: this.#execution.codemodHash,
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
					executionId,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, executionId),
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
					executionId,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, executionId),
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
					executionId,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, executionId),
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
					executionId,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, executionId),
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
					executionId,
				};

				job = {
					...hashlessJob,
					hash: buildJobHash(hashlessJob, executionId),
				};
			} else {
				throw new Error(`Unrecognized message`);
			}

			if (job && !this.#execution.affectedAnyFile) {
				this.#execution.affectedAnyFile = true;
			}

			this.#execution.jobs.push(job);

			const kase = {
				kind: caseKind,
				subKind: codemodName,
			} as const;

			const caseWithJobHashes: CaseWithJobHashes = {
				hash: buildCaseHash(kase, executionId),
				kind: caseKind,
				subKind: codemodName,
				jobHashes: new Set([job.hash]),
				codemodSetName: job.codemodSetName,
				codemodName: job.codemodName,
			};

			this.#execution.case = caseWithJobHashes;

			this.__workspaceState.setSelectedCaseHash(caseWithJobHashes.hash);

			this.__store.dispatch(
				actions.setSelectedCaseHash(caseWithJobHashes.hash),
			);

			this.#messageBus.publish({
				kind: MessageKind.upsertCases,
				casesWithJobHashes: [caseWithJobHashes],
				jobs: [job],
				inactiveJobHashes: new Set(),
				executionId,
			});
		});

		interfase.on('close', async () => {
			if (this.#execution) {
				this.#messageBus.publish({
					kind: MessageKind.codemodSetExecuted,
					executionId: this.#execution.executionId,
					codemodSetName: this.#execution.codemodSetName,
					halted: this.#execution.halted,
					fileCount: this.#execution.totalFileCount,
					jobs: this.#execution.jobs,
					case: this.#execution.case,
					executionErrors,
				});

				if (
					!executionErrors.length &&
					!this.#execution.affectedAnyFile
				) {
					window.showWarningMessage(Messages.noAffectedFiles);
				}
			}

			this.#execution = null;
		});
	}

	async clearOutputFiles(storageUri: Uri) {
		const outputUri = Uri.joinPath(storageUri, 'nora-node-engine');

		await this.#fileSystem.delete(outputUri, {
			recursive: true,
			useTrash: false,
		});
	}
}
