import type { Uri } from 'vscode';

export type JobHash = string & { __type: 'JobHash' };

export const enum JobKind {
	rewriteFile = 1,
}

export type RewriteFileJob = Readonly<{
	kind: JobKind.rewriteFile;
	fileName: string; // to be made inputUri: Uri :)
	title: string; // TODO remove this
	hash: JobHash;
	outputUri: Uri;
}>;

export type Job = RewriteFileJob;
