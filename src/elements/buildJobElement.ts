import { Job, JobKind } from '../jobs/types';
import type { JobElement, ElementHash } from './types';

export const buildJobElement = (
	job: Job,
	fileElementLabel: string,
): JobElement => {
	const verb = job.kind === JobKind.createFile ? 'Create' : 'Rewrite';

	const label = `${verb} ${fileElementLabel}`;

	return {
		kind: 'JOB' as const,
		hash: job.hash as unknown as ElementHash,
		label,
		uri: job.inputUri,
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
