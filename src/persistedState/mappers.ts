import { Uri } from 'vscode';
import { Case, CaseHash } from '../cases/types';
import { Job, JobHash } from '../jobs/types';
import type { PersistedCase, PersistedJob } from './codecs';

export const mapJobToPersistedJob = (job: Job): PersistedJob => ({
	kind: job.kind,
	oldPath: job.oldUri?.fsPath ?? null,
	newPath: job.newUri?.fsPath ?? null,
	oldContentPath: job.oldContentUri?.fsPath ?? null,
	newContentPath: job.newContentUri?.fsPath ?? null,
	hash: job.hash,
	codemodSetName: job.codemodSetName,
	codemodName: job.codemodName,
});

export const mapPersistedJobToJob = (persistedJob: PersistedJob): Job => ({
	kind: persistedJob.kind,
	oldUri: persistedJob.oldPath ? Uri.file(persistedJob.oldPath) : null,
	newUri: persistedJob.newPath ? Uri.file(persistedJob.newPath) : null,
	oldContentUri: persistedJob.oldContentPath
		? Uri.file(persistedJob.oldContentPath)
		: null,
	newContentUri: persistedJob.newContentPath
		? Uri.file(persistedJob.newContentPath)
		: null,
	hash: persistedJob.hash as JobHash,
	codemodSetName: persistedJob.codemodSetName,
	codemodName: persistedJob.codemodName,
	createdAt: Date.now(),
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
