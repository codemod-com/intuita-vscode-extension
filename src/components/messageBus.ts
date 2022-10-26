import {
	Diagnostic,
	Disposable,
	EventEmitter,
	FilePermission,
	Uri,
} from 'vscode';
import type { CaseHash, CaseWithJobHashes } from '../cases/types';
import type { DiagnosticHash } from '../diagnostics/types';
import type { File } from '../files/types';
import type { Job, JobHash, JobOutput } from '../jobs/types';
import type { UriHash } from '../uris/types';

export const enum MessageKind {
	/**
	 * the Intuita (virtual) file-system-related message kinds
	 */
	readingFileFailed = 0,
	writeFile = 1,
	deleteFile = 2,
	changePermissions = 3,

	/**
	 * the external files exist outside of the extension's virtual file system
	 */
	updateExternalFile = 4,
	externalFileUpdated = 5,

	/**
	 * the external diagnostics are such that come from
	 * e.g the TS Language Server
	 */
	externalDiagnostics = 6,

	/**
	 * the internal diagnostics are such that come from
	 * the Intuita VSCode Extensions
	 */
	updateInternalDiagnostics = 7,

	/** cases and jobs */
	upsertCases = 8,
	upsertJobs = 9,
	rejectCase = 10,
	rejectJobs = 11,
	acceptCase = 12,
	acceptJobs = 13,
	jobsAccepted = 14,
}

export type EnhancedDiagnostic = Readonly<{
	uri: Uri;
	diagnostic: Diagnostic;
	hash: DiagnosticHash;
}>;

export type Trigger = 'didSave' | 'onCommand';

export type Message =
	| Readonly<{
			kind: MessageKind.readingFileFailed;
			uri: Uri;
	  }>
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
			kind: MessageKind.updateInternalDiagnostics;
			trigger: Trigger;
	  }>
	| Readonly<{
			kind: MessageKind.updateExternalFile;
			uri: Uri;
			jobOutput: JobOutput;
	  }>
	| Readonly<{
			kind: MessageKind.externalFileUpdated;
			uri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.externalDiagnostics;
			uriHashFileMap: ReadonlyMap<UriHash, File>;
			enhancedDiagnostics: ReadonlyArray<EnhancedDiagnostic>;
			inactiveHashes: ReadonlyArray<DiagnosticHash>;
			trigger: Trigger;
	  }>
	| Readonly<{
			kind: MessageKind.upsertCases;
			uriHashFileMap: ReadonlyMap<UriHash, File>;
			casesWithJobHashes: ReadonlyArray<CaseWithJobHashes>;
			jobs: ReadonlyArray<Job>;
			inactiveHashes: ReadonlyArray<JobHash | DiagnosticHash>;
			trigger: Trigger;
	  }>
	| Readonly<{
			kind: MessageKind.upsertJobs;
			uriHashFileMap: ReadonlyMap<UriHash, File>;
			jobs: ReadonlyArray<Job>;
			inactiveHashes: ReadonlyArray<JobHash | DiagnosticHash>;
			trigger: Trigger;
	  }>
	| Readonly<{
			kind: MessageKind.rejectCase;
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: MessageKind.rejectJobs;
			jobHashes: ReadonlyArray<JobHash>;
	  }>
	| Readonly<{
			kind: MessageKind.acceptCase;
			caseHash: CaseHash;
	  }>
	| Readonly<{
			kind: MessageKind.acceptJobs;
			caseHash: CaseHash;
			jobHashes: ReadonlyArray<JobHash>;
	  }>
	| Readonly<{
			kind: MessageKind.acceptJobs;
			jobHash: JobHash;
			characterDifference: number;
	  }>
	| Readonly<{
			kind: MessageKind.jobsAccepted;
			caseHash: CaseHash | null;
			jobHashes: ReadonlyArray<JobHash>;
	  }>;

export class MessageBus {
	protected _disposables: Disposable[] | undefined = undefined;
	protected _emitter = new EventEmitter<Message>();

	public setDisposables(disposables: Disposable[]): void {
		this._disposables = disposables;
	}

	subscribe(fn: (message: Message) => void): void {
		this._emitter.event(fn, this._disposables);
	}

	publish(message: Message): void {
		this._emitter.fire(message);
	}
}
