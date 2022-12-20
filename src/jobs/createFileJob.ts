import type { Uri } from 'vscode';
import { buildJobHash } from './buildJobHash';
import { CreateFileJob, JobKind } from './types';

export const buildCreateFileJob = (
	inputUri: Uri,
	outputUri: Uri,
	codemodId: string,
): CreateFileJob => {
	return {
		kind: JobKind.createFile,
		inputUri,
		hash: buildJobHash([inputUri, outputUri], codemodId),
		outputUri,
	};
};
