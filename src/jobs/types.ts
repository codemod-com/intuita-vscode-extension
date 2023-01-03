import type { Uri } from 'vscode';

export type JobHash = string & { __type: 'JobHash' };

export const enum JobKind {
	rewriteFile = 1,
	createFile = 2,
}

export type RewriteFileJob = Readonly<{
	kind: JobKind.rewriteFile;
	inputUri: Uri;
	outputUri: Uri;
	hash: JobHash;
	codemodSetName: string;
	codemodName: string;
}>;

export type CreateFileJob = Readonly<{
	kind: JobKind.createFile;
	inputUri: Uri;
	outputUri: Uri;
	hash: JobHash;
	codemodSetName: string;
	codemodName: string;
}>;

export type Job = RewriteFileJob | CreateFileJob;
