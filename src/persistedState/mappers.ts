import { Uri } from 'vscode';
import { Case, CaseHash } from '../cases/types';
import { Job, JobHash } from '../jobs/types';
import type { PersistedCase, PersistedJob } from './codecs';

export const mapJobToPersistedJob = (job: Job): PersistedJob => ({
	kind: job.kind,
	inputPath: job.inputUri.fsPath,
	outputPath: job.outputUri.fsPath,
	hash: job.hash,
	codemodSetName: job.codemodSetName,
	codemodName: job.codemodName,
});

export const mapPersistedJobToJob = (persistedJob: PersistedJob): Job => ({
	kind: persistedJob.kind,
	inputUri: Uri.file(persistedJob.inputPath),
	outputUri: Uri.file(persistedJob.outputPath),
	hash: persistedJob.hash as JobHash,
	codemodSetName: persistedJob.codemodSetName,
	codemodName: persistedJob.codemodName,
});

export const mapCaseToPersistedCase = (kase: Case): PersistedCase => ({
	kind: kase.kind,
	subKind: kase.subKind,
	hash: kase.hash,
	codemodSetName: kase.codemodSetName,
	codemodName: kase.codemodName,
});

export const mapPersistedCaseToCase = (persistedCase: PersistedCase): Case => ({
	kind: persistedCase.kind,
	subKind: persistedCase.subKind,
	hash: persistedCase.hash as CaseHash,
	codemodSetName: persistedCase.codemodSetName,
	codemodName: persistedCase.codemodName,
});
