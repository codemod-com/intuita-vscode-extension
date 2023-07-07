import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';

export const codemodEntryCodec = t.union([
	buildTypeCodec({
		kind: t.literal('codemod'),
		hashDigest: t.string,
		name: t.string,
		engine: t.union([
			t.literal('jscodeshift'),
			t.literal('ts-morph'),
			t.literal('repomod-engine'),
			t.literal('filemod-engine'),
		]),
	}),
	buildTypeCodec({
		kind: t.literal('piranhaRule'),
		hashDigest: t.string,
		name: t.string,
		language: t.string,
		configurationDirectoryBasename: t.string,
	}),
]);

export type CodemodEntry = t.TypeOf<typeof codemodEntryCodec>;
