import { Job, JobKind } from '../jobs/types';
import type { JobElement, ElementHash } from './types';

export const buildJobElement = (job: Job, rootPath: string): JobElement => {
	const oldPath = job.oldUri?.fsPath.replace(rootPath, '') ?? '';
	const newPath = job.newUri?.fsPath.replace(rootPath, '') ?? '';

	let label: string;

	if (job.kind === JobKind.createFile) {
		label = `Create ${newPath}`;
	} else if (job.kind === JobKind.deleteFile) {
		label = `Delete ${oldPath}`;
	} else if (job.kind === JobKind.moveAndRewriteFile) {
		label = `Move & Rewrite ${oldPath} -> ${newPath}`;
	} else if (job.kind === JobKind.moveFile) {
		label = `Move ${oldPath} -> ${newPath}`;
	} else if (job.kind === JobKind.copyFile) {
		label = `Copy ${oldPath} -> ${newPath}`;
	} else if (job.kind === JobKind.rewriteFile) {
		label = `Rewrite ${oldPath}`;
	} else {
		throw new Error();
	}

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
