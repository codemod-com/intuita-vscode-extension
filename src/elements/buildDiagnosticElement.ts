import { Uri } from 'vscode';
import type { Job } from '../jobs/types';
import type { DiagnosticElement, ElementHash } from './types';

export const buildDiagnosticElement = (job: Job): DiagnosticElement => ({
	kind: 'DIAGNOSTIC' as const,
	hash: job.hash as unknown as ElementHash,
	label: job.title,
	fileName: job.fileName,
	uri: Uri.parse(job.fileName),
	range: job.range,
	jobHash: job.hash,
	job,
});
