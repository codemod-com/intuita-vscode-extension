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
		]),
	}),
	buildTypeCodec({
		kind: t.literal('piranhaRule'),
		hashDigest: t.string,
		name: t.string,
		language: t.string,
		configurationDirectoryBasename: t.string, // TO BE REMOVED
		rulesTomlFileBasename: t.string, // TO BE REMOVED
	}),
]);

export type CodemodEntry = t.TypeOf<typeof codemodEntryCodec>;

export const codemodNamesCodec = buildTypeCodec({
	kind: t.literal('names'),
	names: t.readonlyArray(t.string),
});

export type CodemodNames = t.TypeOf<typeof codemodNamesCodec>;
