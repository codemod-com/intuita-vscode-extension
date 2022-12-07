import { Disposable, EventEmitter, FilePermission, Uri } from 'vscode';
import type { CaseHash, CaseWithJobHashes } from '../cases/types';
import type { Job, JobHash } from '../jobs/types';

export const enum MessageKind {
	/**
	 * the Intuita (virtual) file-system-related message kinds
	 */
	writeFile = 1,
	deleteFile = 2,
	changePermissions = 3,

	/**
	 * the external files exist outside of the extension's virtual file system
	 */
	updateExternalFile = 4,

	/** the elements are tree entries */
	updateElements = 7,

	/** cases and jobs */
	upsertCases = 8,
	upsertJobs = 9,
	rejectCase = 10,
	rejectJobs = 11,
	acceptCase = 12,
	acceptJobs = 13,
	jobsAccepted = 14,
}

export type Trigger = 'didSave' | 'onCommand' | 'onDidUpdateConfiguration';

export type Message =
	| Readonly<{
			kind: MessageKind.writeFile;
			uri: Uri;
			content: Uint8Array;
			permissions: FilePermission | null;
	  }>
	| Readonly<{
			kind: MessageKind.deleteFile;
			uri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.changePermissions;
			uri: Uri;
			permissions: FilePermission | null;
	  }>
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
