import type { Diagnostic, TextDocument, TextEditor, Uri, WorkspaceFolder } from "vscode";

export interface VSCodeService {
    readonly openTextDocument: (
        uri: Uri,
    ) => Promise<TextDocument>,
    readonly getVisibleEditors: () => ReadonlyArray<TextEditor>,
    readonly getTextDocuments: () => ReadonlyArray<TextDocument>,
    readonly getActiveTextEditor: () => TextEditor | null,
    readonly showTextDocument: (textDocument: TextDocument) => Promise<TextEditor>,
    readonly getDiagnostics: (
        uri: Uri,
    ) => ReadonlyArray<Diagnostic>,
    readonly getWorkspaceFolder: (uri: Uri) => WorkspaceFolder | null,
}