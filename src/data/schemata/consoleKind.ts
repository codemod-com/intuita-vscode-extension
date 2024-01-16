import * as S from '@effect/schema/Schema';

export const consoleKindSchema = S.union(
	S.literal('debug'),
	S.literal('error'),
	S.literal('log'),
	S.literal('info'),
	S.literal('trace'),
	S.literal('warn'),
);
export type ConsoleKind = S.Schema.To<typeof consoleKindSchema>;
export const parseConsoleKind = S.parseSync(consoleKindSchema);
