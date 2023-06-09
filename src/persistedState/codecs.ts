import * as t from 'io-ts';
import { withFallback } from 'io-ts-types/lib/withFallback';
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
	executionId: t.string,
	modifiedByUser: withFallback(t.boolean, false),
});

export type PersistedJob = t.TypeOf<typeof persistedJobCodec>;

export const persistedCaseCodec = buildTypeCodec({
	kind: t.literal(CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE),
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
	appliedJobsHashes: withFallback(t.readonlyArray(t.string), []),
});

export type PersistedState = t.TypeOf<typeof persistedStateCodec>;

export const syntheticErrorCodec = buildTypeCodec({
	kind: t.literal('syntheticError'),
	message: t.string,
});

export const workspaceStateCodec = t.union([
	buildTypeCodec({
		_tag: t.literal('Left'),
		left: syntheticErrorCodec,
	}),
	buildTypeCodec({
		_tag: t.literal('Right'),
		right: t.string,
	}),
	buildTypeCodec({
		_tag: t.literal('Both'),
		left: syntheticErrorCodec,
		right: t.string,
	}),
]);
