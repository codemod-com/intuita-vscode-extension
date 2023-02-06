import type { Uri } from 'vscode';
import { buildJobHash } from './buildJobHash';
import { Job, JobKind } from './types';

export const buildCreateFileJob = (
	newUri: Uri,
	newContentUri: Uri,
	codemodSetName: string,
	codemodName: string,
): Job => {
	const hashlessJob: Omit<Job, 'hash'> = {
		kind: JobKind.createFile,
		oldUri: null,
		newUri,
		oldContentUri: null,
		newContentUri,
		codemodSetName,
		codemodName,
	};

	return {
		...hashlessJob,
		hash: buildJobHash(hashlessJob),
	};
};
