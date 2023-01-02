import type { Uri } from 'vscode';
import { JobKind, RewriteFileJob } from './types';
import { buildJobHash } from './buildJobHash';

export const buildRewriteFileJob = (
	inputUri: Uri,
	outputUri: Uri,
	codemodSetName: string,
	codemodName: string,
): RewriteFileJob => {
	return {
		kind: JobKind.rewriteFile,
		inputUri,
		hash: buildJobHash([inputUri, outputUri], codemodSetName, codemodName),
		outputUri,
		codemodSetName,
		codemodName,
	};
};
