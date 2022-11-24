import { Uri } from 'vscode';
import { Job } from '../jobs/types';
import { compareIntuitaRange } from '../utilities';
import type { JobElement, ElementHash } from './types';

export const buildJobElement = (
	job: Job,
	fileElementLabel: string,
	showFileElements: boolean,
): JobElement => {
	const label = showFileElements
		? job.title
		: `${job.title} in ${fileElementLabel}`;

	return {
		kind: 'JOB' as const,
		hash: job.hash as unknown as ElementHash,
		label,
		fileName: job.fileName,
		uri: Uri.parse(job.fileName),
		range: null,
		jobHash: job.hash,
		job,
	};
};

export const compareJobElements = (
	left: JobElement,
	right: JobElement,
): number => {
	if (!left.range) {
		return -1;
	}

	if (!right.range) {
		return 1;
	}

	return compareIntuitaRange(left.range, right.range);
};
