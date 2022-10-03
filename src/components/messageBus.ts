import {
	Diagnostic,
	Disposable,
	EventEmitter,
	FilePermission,
	Uri,
} from 'vscode';
import { JobOutput } from '../jobs';
import { InferenceJob } from './inferenceService';

export const enum MessageKind {
	/**
	 * the Intuita (virtual) file-system-related message kinds
	 */
	readingFileFailed = 0,
	writeFile = 1,
	deleteFile = 2,
	changePermissions = 3,
	createRepairCodeJobs = 4,
	/**
	 * the external diagnostics are such that come from
	 * e.g the TS Language Server
	 */
	noExternalDiagnostics = 5,
	newExternalDiagnostics = 6,
	/**
	 * the internal diagnostics are such that come from
	 * the Intuita VSCode Extensions
	 */
	updateInternalDiagnostics = 7,
	textDocumentChanged = 8,
	ruleBasedCoreRepairDiagnosticsChanged = 9, // TODO
	/**
	 * the external files exist outside of the extension's virtual file system
	 */
	updateExternalFile = 10,
	externalFileUpdated = 11,
}

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
			kind: MessageKind.createRepairCodeJobs;
			uri: Uri;
			text: string;
			version: number;
			inferenceJobs: ReadonlyArray<InferenceJob>;
	  }>
	| Readonly<{
			kind: MessageKind.noExternalDiagnostics;
			uri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.updateInternalDiagnostics;
			fileName: string;
	  }>
	| Readonly<{
			kind: MessageKind.textDocumentChanged;
			uri: Uri;
	  }>
	| Readonly<{
			kind: MessageKind.ruleBasedCoreRepairDiagnosticsChanged;
			uri: Uri;
			version: number;
			text: string;
			diagnostics: ReadonlyArray<Diagnostic>;
	  }>
	| Readonly<{
			kind: MessageKind.newExternalDiagnostics;
			uri: Uri;
			version: number;
			text: string;
			diagnostics: ReadonlyArray<Diagnostic>;
	  }>
	| Readonly<{
			kind: MessageKind.updateExternalFile;
			uri: Uri;
			jobOutput: JobOutput;
	  }>
	| Readonly<{
			kind: MessageKind.externalFileUpdated;
			uri: Uri;
			text: string;
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
