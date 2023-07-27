import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';

export type SyntheticError = Readonly<{
	kind: 'syntheticError';
	message: string;
}>;

export const executionErrorCodec = t.union([
	t.string,
	buildTypeCodec({
		message: t.string,
		caseTitle: t.union([t.string, t.undefined]),
		filePath: t.union([t.string, t.undefined]),
		kind: t.union([
			t.literal('unrecognizedCodemod'),
			t.literal('errorRunningCodemod'),
			t.undefined,
		]),
	}),
]);

export type ExecutionError = t.TypeOf<typeof executionErrorCodec>;
