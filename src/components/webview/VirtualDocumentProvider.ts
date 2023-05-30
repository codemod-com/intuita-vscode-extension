import * as vscode from 'vscode';
import { basename, extname } from 'node:path';

export class MetadataNotFoundError extends Error {}

export class TextDocumentContentProvider
	implements vscode.TextDocumentContentProvider
{
	private __codemodMetadata: Record<string, string> | null = null;
	public onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	public onDidChange = this.onDidChangeEmitter.event;

	constructor() {
		this.__fetchCodemodMetadata();
	}

	public hasMetadata(uri: vscode.Uri): boolean {
		return this.__getCodemodMetadata(uri) !== null;
	}

	public provideTextDocumentContent(uri: vscode.Uri): string {
		return this.__getCodemodMetadata(uri) ?? '';
	}

	private async __fetchCodemodMetadata(): Promise<void> {
		// @TODO load metadata
		this.__codemodMetadata = {};
	}

	private __getCodemodMetadata(uri: vscode.Uri): string | null {
		if (this.__codemodMetadata === null) {
			return null;
		}

		const { path } = uri;
		const codemodHash = basename(path, extname(path));

		return this.__codemodMetadata[codemodHash] ?? null;
	}
}
