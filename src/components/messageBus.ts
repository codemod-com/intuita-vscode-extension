import { Diagnostic, Disposable, EventEmitter, FilePermission, Uri } from 'vscode';
import { InferenceJob } from "./inferenceService";

export const enum MessageKind {
    readingFileFailed = 0,
    writeFile = 1,
    deleteFile = 2,
    changePermissions = 3,
    createRepairCodeJobs = 4,
    noTypeScriptDiagnostics = 5,
    updateDiagnostics = 6,
    textDocumentChanged = 7,
    ruleBasedCoreRepairDiagnosticsChanged = 8,
    /**
     * the external diagnostics are such that come from 
     * e.g the TS Language Server
     */
    newExternalDiagnostics = 9,
}

export type Message =
    | Readonly<{
        kind: MessageKind.readingFileFailed,
        uri: Uri,
    }>
    | Readonly<{
        kind: MessageKind.writeFile,
        uri: Uri,
        content: Uint8Array,
        permissions: FilePermission | null,
    }>
    | Readonly<{
        kind: MessageKind.deleteFile,
        uri: Uri,
    }>
    | Readonly<{
        kind: MessageKind.changePermissions,
        uri: Uri,
        permissions: FilePermission | null,
    }>
    | Readonly<{
        kind: MessageKind.createRepairCodeJobs,
        uri: Uri,
        version: number,
        inferenceJobs: ReadonlyArray<InferenceJob>,
    }>
    | Readonly<{
        kind: MessageKind.noTypeScriptDiagnostics,
        uri: Uri,
    }>
    | Readonly<{
        kind: MessageKind.updateDiagnostics,
        fileName: string,
    }>
    | Readonly<{
        kind: MessageKind.textDocumentChanged,
        uri: Uri,
    }>
    | Readonly<{
        kind: MessageKind.ruleBasedCoreRepairDiagnosticsChanged,
        uri: Uri,
        version: number,
        text: string,
        diagnostics: ReadonlyArray<Diagnostic>,
    }>
    | Readonly<{
        kind: MessageKind.newExternalDiagnostics,
        uri: Uri,
        diagnostics: ReadonlyArray<Diagnostic>,
    }>;

export class MessageBus {
    protected _disposables: Disposable[] | undefined = undefined;
    protected _emitter = new EventEmitter<Message>();

    public setDisposables(
        disposables: Disposable[]
    ): void {
        this._disposables = disposables;
    }

    subscribe(
        fn: (message: Message) => void,
    ): void {
        this._emitter.event(fn, this._disposables);
    }

    publish(
        message: Message,
    ): void {
        this._emitter.fire(message);
    }
}
