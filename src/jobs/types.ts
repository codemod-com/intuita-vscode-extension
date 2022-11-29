import type { Uri } from 'vscode';

export type JobHash = string & { __type: 'JobHash' };

export const enum JobKind {
	rewriteFile = 3,
}

export type RewriteFileJob = Readonly<{
	kind: JobKind.rewriteFile;
	fileName: string; // to be made inputUri: Uri :)
	title: string; // TODO remove this
	hash: JobHash;
	outputUri: Uri;
	diagnosticHash: null;
}>;

export type Job = RewriteFileJob;
