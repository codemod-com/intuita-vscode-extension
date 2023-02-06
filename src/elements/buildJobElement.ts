import { Job, JobKind } from '../jobs/types';
import type { JobElement, ElementHash } from './types';

export const buildJobElement = (
	job: Job,
	fileElementLabel: string,
): JobElement => {
	let verb: string;

	if (job.kind === JobKind.createFile) {
		verb = 'Create';
	} else if (job.kind === JobKind.deleteFile) {
		verb = 'Delete';
	} else if (job.kind === JobKind.moveAndRewriteFile) {
		verb = 'Move & Rewrite';
	} else if (job.kind === JobKind.moveFile) {
		verb = 'Move';
	} else if (job.kind === JobKind.rewriteFile) {
		verb = 'Rewrite';
	} else {
		throw new Error();
	}

	const label = `${verb} ${fileElementLabel}`;

	return {
		kind: 'JOB' as const,
		hash: job.hash as unknown as ElementHash,
		label,
		uri: job.oldUri, // TODO check
		jobHash: job.hash,
		job,
	};
};

export const compareJobElements = (
	left: JobElement,
	right: JobElement,
): number => {
	return left.hash.localeCompare(right.hash);
};
