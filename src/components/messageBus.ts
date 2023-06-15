import { Disposable, EventEmitter, Uri } from 'vscode';
import type { CaseHash, CaseWithJobHashes } from '../cases/types';
import type { Job, JobHash } from '../jobs/types';
import type { Configuration } from '../configuration';
import { CodemodHash } from '../packageJsonAnalyzer/types';
import { ExecutionError } from '../errors/types';

export const enum MessageKind {
	/** the elements are tree entries */
	updateElements = 2,

	/** cases and jobs */
	upsertCases = 3,
	upsertJobs = 4,

	rejectCase = 5,
	rejectJobs = 6,
	jobsRejected = 7,

	acceptCase = 8,
	acceptJobs = 9,
	jobsAccepted = 10,

	/** bootstrap */
	bootstrapEngine = 13,
	engineBootstrapped = 14,

	/** state */
	clearState = 16,

	/** information message */
	showInformationMessage = 17,

	/** codemod sets */
	executeCodemodSet = 18,
	codemodSetExecuted = 19,

	/** file system operations */
	updateFile = 22,
	deleteFiles = 23,
	moveFile = 24,
	createFile = 25,

	/**
	 * config events
	 */

	configurationChanged = 28,

	/**
	 * show progress
	 */
	showProgress = 31,

	focusCodemod = 35,

	afterDryRunHooksExecuted = 36,

	focusFile = 37,
	focusFolder = 38,
}

export type Command =
	| Readonly<{
			kind: 'repomod';
			inputPath: Uri;
			storageUri: Uri;
			repomodFilePath: string;
	  }>
	| Readonly<{
			fileUri: Uri;
			storageUri: Uri;
			uri: Uri;
			directory: boolean;
	  }>
	| Readonly<{
			kind: 'executeCodemod';
			codemodHash: CodemodHash;
			storageUri: Uri;
			uri: Uri;
			directory: boolean;
	  }>;

export type Message =
	| Readonly<{
			kind: MessageKind.updateElements;
	  }>
	| Readonly<{
			kind: MessageKind.upsertCases;
			casesWithJobHashes: ReadonlyArray<CaseWithJobHashes>;
			jobs: ReadonlyArray<Job>;
			executionId: string;
	  }>
	| Readonly<{
			kind: MessageKind.upsertJobs;
			jobs: ReadonlyArray<Job>;
	  }>
	| Readonly<{
			kind: MessageKind.rejectCase;
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: MessageKind.rejectJobs;
			jobHashes: ReadonlySet<JobHash>;
	  }>
	| Readonly<{
			kind: MessageKind.jobsRejected;
			deletedJobs: ReadonlySet<Job>;
	  }>
	| Readonly<{
			kind: MessageKind.acceptCase;
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: MessageKind.acceptJobs;
			jobHashes: ReadonlySet<JobHash>;
	  }>
	| Readonly<{
			kind: MessageKind.jobsAccepted;
			deletedJobs: ReadonlySet<Job>;
	  }>
	| Readonly<{
			kind: MessageKind.bootstrapEngine;
	  }>
	| Readonly<{
			kind: MessageKind.engineBootstrapped;
			noraNodeEngineExecutableUri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.clearState;
	  }>
	| Readonly<{
			kind: MessageKind.executeCodemodSet;
			command: Command;
			happenedAt: string;
			executionId: string;
	  }>
	| Readonly<{
			kind: MessageKind.codemodSetExecuted;
			executionId: string;
			codemodSetName: string;
			halted: boolean;
			fileCount: number;
			jobs: Job[];
			case: CaseWithJobHashes;
			executionErrors: ReadonlyArray<ExecutionError>;
	  }>
	| Readonly<{
			kind: MessageKind.updateFile;
			uri: Uri;
			contentUri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.deleteFiles;
			uris: ReadonlyArray<Uri>;
	  }>
	| Readonly<{
			kind: MessageKind.createFile;
			newUri: Uri;
			newContentUri: Uri;
			deleteNewContentUri: boolean;
	  }>
	| Readonly<{
			kind: MessageKind.moveFile;
			newUri: Uri;
			oldUri: Uri;
			newContentUri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.configurationChanged;
			nextConfiguration: Configuration;
	  }>
	| Readonly<{
			kind: MessageKind.showProgress;
			processedFiles: number;
			codemodHash?: CodemodHash;
			totalFiles: number;
	  }>
	| Readonly<{
			kind: MessageKind.focusCodemod;
			codemodHashDigest: CodemodHash;
	  }>
	| Readonly<{
			kind: MessageKind.afterDryRunHooksExecuted;
	  }>
	| Readonly<{
			kind: MessageKind.focusFile;
			caseHash: CaseHash;
			jobHash: JobHash;
	  }>
	| Readonly<{
			kind: MessageKind.focusFolder;
			caseHash: CaseHash;
			folderPath: string;
	  }>;

type EmitterMap<K extends MessageKind> = {
	[k in K]?: EventEmitter<Message & { kind: K }>;
};

export class MessageBus {
	#disposables: Disposable[] | undefined = undefined;

	#emitters: EmitterMap<MessageKind> = {};

	public setDisposables(disposables: Disposable[]): void {
		this.#disposables = disposables;
	}

	subscribe<K extends MessageKind>(
		kind: K,
		fn: (message: Message & { kind: K }) => void,
	) {
		let emitter = this.#emitters[kind] as
			| EventEmitter<Message & { kind: K }>
			| undefined;

		if (!emitter) {
			emitter = new EventEmitter<Message & { kind: K }>();

			this.#emitters[kind] = emitter;
		}

		return emitter.event(fn, this.#disposables);
	}

	publish(message: Message): void {
		const emitter = this.#emitters[message.kind];

		emitter?.fire(message);
	}
}
