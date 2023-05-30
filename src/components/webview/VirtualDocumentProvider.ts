import * as vscode from 'vscode';
import { basename, extname } from 'node:path';

export class MetadataNotFoundError extends Error {}

export class TextDocumentContentProvider
	implements vscode.TextDocumentContentProvider
{
	private __codemodMetadata: Record<string, string> | null = null;

	constructor() {
		this.__fetchCodemodMetadata();
	}

	private async __fetchCodemodMetadata(): Promise<void> {
		// @TODO load metadata
		this.__codemodMetadata = {};
	}

	onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	onDidChange = this.onDidChangeEmitter.event;

	private __getCodemodMetadata(uri: vscode.Uri): string | null {
		if (this.__codemodMetadata === null) {
			return null;
		}

		const { path } = uri;
		const codemodHash = basename(path, extname(path));

		return this.__codemodMetadata[codemodHash] ?? null;
	}

	public hasMetadata(uri: vscode.Uri): boolean {
		return this.__getCodemodMetadata(uri) !== null;
	}

	public provideTextDocumentContent(uri: vscode.Uri): string {
		return this.__getCodemodMetadata(uri) ?? '';
	}
}
