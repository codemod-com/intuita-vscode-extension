import type { Uri } from 'vscode';
import { buildJobHash } from './buildJobHash';
import { CreateFileJob, JobKind } from './types';

export const buildCreateFileJob = (
	inputUri: Uri,
	outputUri: Uri,
	codemodSetName: string,
	codemodName: string,
): CreateFileJob => {
	return {
		kind: JobKind.createFile,
		inputUri,
		hash: buildJobHash([inputUri, outputUri], codemodSetName, codemodName),
		outputUri,
		codemodName,
		codemodSetName,
	};
};
