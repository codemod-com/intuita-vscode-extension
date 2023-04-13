import { Disposable, EventEmitter, Uri } from 'vscode';
import type { CaseHash, CaseKind, CaseWithJobHashes } from '../cases/types';
import type { Job, JobHash } from '../jobs/types';
import { RecipeName } from '../recipes/codecs';
import type { Configuration } from '../configuration';
import type { CodemodHash } from '../packageJsonAnalyzer/types';

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

	/** file comparison */
	compareFiles = 11,
	filesCompared = 12,

	/** bootstrap */
	bootstrapEngines = 13,
	enginesBootstrapped = 14,

	/** state */
	clearState = 16,

	/** information message */
	showInformationMessage = 17,

	/** codemod sets */
	executeCodemodSet = 18,
	codemodSetExecuted = 19,

	/** extension states */
	extensionActivated = 20,
	extensionDeactivated = 21,

	/** file system operations */
	updateFile = 22,
	deleteFiles = 23,
	moveFile = 24,
	createFile = 25,

	/**
	 * account events
	 */
	accountLinked = 26,
	accountUnlinked = 27,

	/**
	 * config events
	 */

	configurationChanged = 28,

	/**
	 * create issue
	 */

	beforeIssueCreated = 29,
	afterIssueCreated = 30,
	/**
	 * show progress
	 */
	showProgress = 31,
	/** run codemod */
	runCodemod = 32,

	/**
	 * create PR
	 */

	beforePRCreated = 33,
	afterPRCreated = 34,

	repositoryPathChanged = 35,

	/**
	 * view breakdown
	 */

	caseBreakdown = 36,
	folderBreakdown = 37,
}

export type Engine = 'node' | 'rust';

export type Command =
	| Readonly<{
			kind: 'repomod';
			engine: Engine;
			inputPath: Uri;
			storageUri: Uri;
			repomodFilePath: string;
	  }>
	| Readonly<{
			recipeName: RecipeName;
			engine: Engine;
			storageUri: Uri;
			uri: Uri;
	  }>
	| Readonly<{
			fileUri: Uri;
			engine: Engine;
			storageUri: Uri;
			uri: Uri;
	  }>;

export type Message =
	| Readonly<{
			kind: MessageKind.updateElements;
	  }>
	| Readonly<{
			kind: MessageKind.upsertCases;
			casesWithJobHashes: ReadonlyArray<CaseWithJobHashes>;
			jobs: ReadonlyArray<Job>;
			inactiveJobHashes: ReadonlySet<JobHash>;
			executionId: string;
	  }>
	| Readonly<{
			kind: MessageKind.upsertJobs;
			jobs: ReadonlyArray<Job>;
			inactiveJobHashes: ReadonlySet<JobHash>;
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
			deletedJobHashes: ReadonlySet<JobHash>;
			codemodSetName: string;
			codemodName: string;
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
			deletedJobHashes: ReadonlySet<JobHash>;
			codemodSetName: string;
			codemodName: string;
	  }>
	| Readonly<{
			kind: MessageKind.compareFiles;
			noraRustEngineExecutableUri: Uri;
			job: Job;
			caseKind: CaseKind;
			caseSubKind: string;
			executionId: string;
			codemodSetName: string;
			codemodName: string;
	  }>
	| Readonly<{
			kind: MessageKind.filesCompared;
			jobHash: JobHash;
			equal: boolean;
			executionId: string;
			codemodSetName: string;
			codemodName: string;
	  }>
	| Readonly<{
			kind: MessageKind.bootstrapEngines;
	  }>
	| Readonly<{
			kind: MessageKind.enginesBootstrapped;
			noraNodeEngineExecutableUri: Uri;
			noraRustEngineExecutableUri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.clearState;
	  }>
	| Readonly<{
			kind: MessageKind.caseBreakdown;
	  }>
	| Readonly<{
			kind: MessageKind.folderBreakdown;
	  }>
	| Readonly<{
			kind: MessageKind.showInformationMessage;
			packageSettingsUri: Uri;
			dependencyName: string;
			dependencyOldVersion: string;
			dependencyNewVersion: string | null;
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
	  }>
	| Readonly<{
			kind: MessageKind.extensionActivated;
	  }>
	| Readonly<{
			kind: MessageKind.extensionDeactivated;
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
			kind: MessageKind.accountUnlinked;
	  }>
	| Readonly<{
			kind: MessageKind.accountLinked;
			account: string;
	  }>
	| Readonly<{
			kind: MessageKind.configurationChanged;
			nextConfiguration: Configuration;
	  }>
	| Readonly<{
			kind: MessageKind.beforeIssueCreated;
	  }>
	| Readonly<{
			kind: MessageKind.beforeIssueCreated;
	  }>
	| Readonly<{
			kind: MessageKind.afterIssueCreated;
	  }>
	| Readonly<{
			kind: MessageKind.showProgress;
			processedFiles: number;
			totalFiles: number;
	  }>
	| Readonly<{
			kind: MessageKind.runCodemod;
			codemodHash: CodemodHash;
	  }>
	| Readonly<{
			kind: MessageKind.beforePRCreated;
	  }>
	| Readonly<{
			kind: MessageKind.afterPRCreated;
	  }>
	| Readonly<{
			kind: MessageKind.repositoryPathChanged;
			repositoryPath: string | null;
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
