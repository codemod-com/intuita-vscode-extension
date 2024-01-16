import * as S from '@effect/schema/Schema';

const mainThreadMessageSchema = S.union(S.struct({ kind: S.literal('exit') }));
export type MainThreadMessage = S.Schema.To<typeof mainThreadMessageSchema>;
export const decodeMainThreadMessage = S.parseSync(mainThreadMessageSchema);
