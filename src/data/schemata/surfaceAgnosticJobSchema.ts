import * as S from '@effect/schema/Schema';

export enum JOB_KIND {
	REWRITE_FILE = 1,
	CREATE_FILE = 2,
	DELETE_FILE = 3,
	MOVE_FILE = 4,
	MOVE_AND_REWRITE_FILE = 5,
	COPY_FILE = 6,
}

const jobKindSchema = S.union(
	S.literal(JOB_KIND.REWRITE_FILE),
	S.literal(JOB_KIND.CREATE_FILE),
	S.literal(JOB_KIND.DELETE_FILE),
	S.literal(JOB_KIND.MOVE_FILE),
	S.literal(JOB_KIND.MOVE_AND_REWRITE_FILE),
	S.literal(JOB_KIND.COPY_FILE),
);

export const parseJobKind = S.parseSync(jobKindSchema);

const surfaceAgnosticJobSchema = S.struct({
	jobHashDigest: S.string,
	kind: jobKindSchema,
	oldUri: S.string,
	newUri: S.string,
});

export const parseSurfaceAgnosticJob = S.parseSync(surfaceAgnosticJobSchema);

export type SurfaceAgnosticJob = S.To<typeof surfaceAgnosticJobSchema>;
