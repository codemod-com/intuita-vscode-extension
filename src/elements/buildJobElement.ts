import { Job, JobKind } from '../jobs/types';
import { JobElement, ElementHash, ElementKind } from './types';

export const jobKindCopyMap = {
	[JobKind.createFile]: 'Create',
	[JobKind.deleteFile]: 'Delete',
	[JobKind.moveAndRewriteFile]: 'Move & Rewrite',
	[JobKind.moveFile]: 'Move',
	[JobKind.copyFile]: 'Copy',
	[JobKind.rewriteFile]: 'Rewrite',
};

export const buildJobElementLabel = (job: Job, rootPath: string): string => {
	const oldPath = job.oldUri?.fsPath.replace(rootPath, '') ?? '';
	const newPath = job.newUri?.fsPath.replace(rootPath, '') ?? '';

	let label: string = jobKindCopyMap[job.kind];
	if (job.kind === JobKind.createFile) {
		label += ` ${newPath}`;
	} else if (job.kind === JobKind.deleteFile) {
		label += ` ${oldPath}`;
	} else if (job.kind === JobKind.moveAndRewriteFile) {
		label += ` ${oldPath} -> ${newPath}`;
	} else if (job.kind === JobKind.moveFile) {
		label += ` ${oldPath} -> ${newPath}`;
	} else if (job.kind === JobKind.copyFile) {
		label += ` ${oldPath} -> ${newPath}`;
	} else if (job.kind === JobKind.rewriteFile) {
		label += ` ${oldPath}`;
	} else {
		throw new Error();
	}

	return label;
};

export const buildJobElement = (job: Job, rootPath: string): JobElement => {
	const label = buildJobElementLabel(job, rootPath);

	return {
		kind: ElementKind.JOB,
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
