import type { Uri } from 'vscode';

export type JobHash = string & { __type: 'JobHash' };

export const enum JobKind {
	rewriteFile = 1,
}

export type RewriteFileJob = Readonly<{
	kind: JobKind.rewriteFile;
	inputUri: Uri;
	outputUri: Uri;
	title: string;
	hash: JobHash;
}>;

export type Job = RewriteFileJob;
