import * as S from '@effect/schema/Schema';

export const argumentRecordSchema = S.record(
	S.string,
	S.union(S.string, S.number, S.boolean),
);

export const parseArgumentRecordSchema = S.parseSync(argumentRecordSchema);

export type ArgumentRecord = S.To<typeof argumentRecordSchema>;
