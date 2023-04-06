import * as t from 'io-ts';
import { CaseKind } from '../cases/types';
import { JobKind } from '../jobs/types';
import { buildTypeCodec } from '../utilities';

export const persistedJobCodec = buildTypeCodec({
	kind: t.union([
		t.literal(JobKind.rewriteFile),
		t.literal(JobKind.createFile),
		t.literal(JobKind.deleteFile),
		t.literal(JobKind.moveAndRewriteFile),
		t.literal(JobKind.moveFile),
		t.literal(JobKind.copyFile),
	]),
	oldPath: t.union([t.string, t.null]),
	newPath: t.union([t.string, t.null]),
	oldContentPath: t.union([t.string, t.null]),
	newContentPath: t.union([t.string, t.null]),
	hash: t.string,
	codemodSetName: t.string,
	codemodName: t.string,
});

export type PersistedJob = t.TypeOf<typeof persistedJobCodec>;

export const persistedCaseCodec = buildTypeCodec({
	kind: t.union([
		t.literal(CaseKind.REWRITE_FILE_BY_POLYGLOT_PIRANHA),
		t.literal(CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE),
		t.literal(CaseKind.REWRITE_FILE_BY_NORA_RUST_ENGINE),
	]),
	subKind: t.string,
	hash: t.string,
	codemodSetName: t.string,
	codemodName: t.string,
});

export type PersistedCase = t.TypeOf<typeof persistedCaseCodec>;

export const persistedStateCodec = buildTypeCodec({
	cases: t.readonlyArray(persistedCaseCodec),
	jobs: t.readonlyArray(persistedJobCodec),
	caseHashJobHashes: t.readonlyArray(t.string),
	acceptedJobsHashes: t.readonlyArray(t.string),
});

export type PersistedState = t.TypeOf<typeof persistedStateCodec>;
