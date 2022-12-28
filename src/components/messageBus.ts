import { Disposable, EventEmitter, Uri } from 'vscode';
import type { CaseHash, CaseKind, CaseWithJobHashes } from '../cases/types';
import type { Job, JobHash } from '../jobs/types';

export const enum MessageKind {
	/**
	 * the external files exist outside of the extension's virtual file system
	 */
	updateExternalFile = 1,

	/** the elements are tree entries */
	updateElements = 2,

	/** cases and jobs */
	upsertCases = 3,
	upsertJobs = 4,
	rejectCase = 5,
	rejectJobs = 6,
	acceptCase = 7,
	acceptJobs = 8,
	jobsAccepted = 9,

	/** file comparison */
	compareFiles = 10,
	filesCompared = 11,

	/** bootstrap */
	bootstrapExecutables = 12,
	executablesBootstrapped = 13,

	/** state */
	persistState = 14,
	clearState = 15,

	/** information message */
	showInformationMessage = 16,
}

export type Engine = 'node' | 'rust';
export type Group = 'nextJs' | 'mui';

export type Command =
	| Readonly<{
			group: Group;
			engine: Engine;
			storageUri: Uri;
			uri: Uri;
	  }>
	| Readonly<{
			fileUri: Uri;
			engine: Engine;
			storageUri: Uri;
	  }>;

export type Trigger = 'onCommand' | 'onDidUpdateConfiguration' | 'bootstrap';

export type Message =
	| Readonly<{
			kind: MessageKind.updateElements;
			trigger: Trigger;
	  }>
	| Readonly<{
			kind: MessageKind.updateExternalFile;
			uri: Uri;
			contentUri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.upsertCases;
			casesWithJobHashes: ReadonlyArray<CaseWithJobHashes>;
			jobs: ReadonlyArray<Job>;
			inactiveJobHashes: ReadonlySet<JobHash>;
			trigger: Trigger;
	  }>
	| Readonly<{
			kind: MessageKind.upsertJobs;
			jobs: ReadonlyArray<Job>;
			inactiveJobHashes: ReadonlySet<JobHash>;
			trigger: Trigger;
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
			kind: MessageKind.acceptCase;
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: MessageKind.acceptJobs;
			jobHashes: ReadonlySet<JobHash>;
	  }>
	| Readonly<{
			kind: MessageKind.acceptJobs;
			jobHash: JobHash;
	  }>
	| Readonly<{
			kind: MessageKind.jobsAccepted;
			deletedJobHashes: ReadonlySet<JobHash>;
	  }>
	| Readonly<{
			kind: MessageKind.compareFiles;
			noraRustEngineExecutableUri: Uri;
			job: Job;
			caseKind: CaseKind;
			caseSubKind: string;
	  }>
	| Readonly<{
			kind: MessageKind.filesCompared;
			jobHash: JobHash;
			equal: boolean;
	  }>
	| Readonly<{
			kind: MessageKind.bootstrapExecutables;
			command: Command;
	  }>
	| Readonly<{
			kind: MessageKind.executablesBootstrapped;
			command: Command;
			noraNodeEngineExecutableUri: Uri;
			noraRustEngineExecutableUri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.persistState;
	  }>
	| Readonly<{
			kind: MessageKind.clearState;
	  }>
	| Readonly<{
			kind: MessageKind.showInformationMessage;
			packageSettingsUri: Uri;
			dependencyName: string;
			dependencyOldVersion: string;
			dependencyNewVersion: string | null;
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

		emitter.event(fn, this.#disposables);
	}

	publish(message: Message): void {
		const emitter = this.#emitters[message.kind];

		emitter?.fire(message);
	}
}
