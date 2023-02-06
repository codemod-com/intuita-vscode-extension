import type { Uri } from 'vscode';
import { Job, JobKind } from './types';
import { buildJobHash } from './buildJobHash';

export const buildRewriteFileJob = (
	oldUri: Uri,
	newContentUri: Uri,
	codemodSetName: string,
	codemodName: string,
): Job => {
	const hashlessJob: Omit<Job, 'hash'> = {
		kind: JobKind.rewriteFile,
		oldUri,
		newUri: oldUri,
		newContentUri,
		oldContentUri: oldUri,
		codemodSetName,
		codemodName,
	};

	return {
		...hashlessJob,
		hash: buildJobHash(hashlessJob),
	};
};
