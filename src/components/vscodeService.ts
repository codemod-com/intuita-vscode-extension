import type {
	Diagnostic,
	TextDocument,
	TextDocumentShowOptions,
	TextEditor,
	Uri,
	WorkspaceFolder,
} from 'vscode';

export interface VSCodeService {
	readonly openTextDocument: (uri: Uri) => Promise<TextDocument>;
	readonly getVisibleEditors: () => ReadonlyArray<TextEditor>;
	readonly getTextDocuments: () => ReadonlyArray<TextDocument>;
	readonly getActiveTextEditor: () => TextEditor | null;
	readonly showTextDocument: (
		textDocument: TextDocument,
		options?: TextDocumentShowOptions,
	) => Promise<TextEditor>;
	readonly getDiagnostics: () => ReadonlyArray<
		[Uri, ReadonlyArray<Diagnostic>]
	>;
	readonly getWorkspaceFolder: (uri: Uri) => WorkspaceFolder | null;
}
