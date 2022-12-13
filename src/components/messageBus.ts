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
}

export type Trigger = 'didSave' | 'onCommand' | 'onDidUpdateConfiguration';

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
			job: Job,
			caseKind: CaseKind,
			caseSubKind: string,
	}>
	| Readonly<{
			kind: MessageKind.filesCompared;
			job: Job,
			caseKind: CaseKind,
			caseSubKind: string,
			equal: boolean,
	}>;

export class MessageBus {
	#disposables: Disposable[] | undefined = undefined;
	#emitter = new EventEmitter<Message>();

	public setDisposables(disposables: Disposable[]): void {
		this.#disposables = disposables;
	}

	subscribe(fn: (message: Message) => void): void {
		this.#emitter.event(fn, this.#disposables);
	}

	publish(message: Message): void {
		this.#emitter.fire(message);
	}
}
