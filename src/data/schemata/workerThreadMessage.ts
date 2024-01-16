import * as S from '@effect/schema/Schema';
import { consoleKindSchema } from './consoleKind';

const workerThreadMessageSchema = S.union(
	S.struct({
		kind: S.literal('commands'),
		commands: S.unknown,
	}),
	S.struct({
		kind: S.literal('error'),
		message: S.string,
		path: S.union(S.string, S.undefined),
	}),
	S.struct({
		kind: S.literal('console'),
		consoleKind: consoleKindSchema,
		message: S.string,
	}),
);

export type WorkerThreadMessage = S.Schema.To<typeof workerThreadMessageSchema>;
export const decodeWorkerThreadMessage = S.parseSync(workerThreadMessageSchema);
