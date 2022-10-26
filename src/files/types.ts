import type { SourceFile } from 'typescript';
import type { Uri } from 'vscode';

export type File = Readonly<{
	// source of truth
	uri: Uri;
	text: string;
	version: number;

	// calculated, yet immutable
	separator: string;
	lines: ReadonlyArray<string>;
	lengths: ReadonlyArray<number>;
	sourceFile: SourceFile;
}>;
