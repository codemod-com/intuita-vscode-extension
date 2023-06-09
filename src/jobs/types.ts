import type { Uri } from 'vscode';

export type JobHash = string & { __type: 'JobHash' };

export const enum JobKind {
	rewriteFile = 1,
	createFile = 2,
	deleteFile = 3,
	moveFile = 4,
	moveAndRewriteFile = 5,
	copyFile = 6,
}

export type Job = Readonly<{
	hash: JobHash;
	kind: JobKind;
	oldUri: Uri | null;
	newUri: Uri | null;
	oldContentUri: Uri | null;
	newContentUri: Uri | null;
	codemodSetName: string;
	codemodName: string;
	createdAt: number;
	executionId: string;
	modifiedByUser: boolean;
}>;
