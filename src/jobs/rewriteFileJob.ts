import type { Uri } from 'vscode';
import { JobHash, JobKind, RewriteFileJob } from './types';
import { buildUriHash } from '../uris/buildUriHash';
import { buildHash } from '../utilities';

export const buildRewriteFileJobHash = (
	inputUri: Uri,
	outputUri: Uri,
	codemodId: string,
): JobHash => {
	const inputUriHash = buildUriHash(inputUri);
	const outputUriHash = buildUriHash(outputUri);

	const hash = buildHash([inputUriHash, outputUriHash, codemodId].join(','));

	return hash as JobHash;
};

export const buildRewriteFileJob = (
	inputUri: Uri,
	outputUri: Uri,
	codemodId: string,
): RewriteFileJob => {
	return {
		kind: JobKind.rewriteFile,
		inputUri,
		title: `Rewrite the file (${codemodId})`,
		hash: buildRewriteFileJobHash(inputUri, outputUri, codemodId),
		outputUri,
	};
};
