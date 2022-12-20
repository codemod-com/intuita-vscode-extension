import type { Uri } from 'vscode';
import { JobKind, RewriteFileJob } from './types';
import { buildJobHash } from './buildJobHash';

export const buildRewriteFileJob = (
	inputUri: Uri,
	outputUri: Uri,
	codemodId: string,
): RewriteFileJob => {
	return {
		kind: JobKind.rewriteFile,
		inputUri,
		hash: buildJobHash([inputUri, outputUri], codemodId),
		outputUri,
	};
};
