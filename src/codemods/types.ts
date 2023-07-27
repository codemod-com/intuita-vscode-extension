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
			t.literal('recipe'),
		]),
	}),
	buildTypeCodec({
		kind: t.literal('piranhaRule'),
		hashDigest: t.string,
		name: t.string,
		language: t.string,
	}),
]);

export const privateCodemodEntryCodec = buildTypeCodec({
	kind: t.literal('codemod'),
	hashDigest: t.string,
	name: t.string,
	engine: t.union([
		t.literal('jscodeshift'),
		t.literal('ts-morph'),
		t.literal('repomod-engine'),
		t.literal('recipe'),
	]),
	permalink: t.union([t.string, t.null]),
});

export type CodemodEntry = t.TypeOf<typeof codemodEntryCodec>;

export const codemodNamesCodec = buildTypeCodec({
	kind: t.literal('names'),
	names: t.readonlyArray(t.string),
});

export type CodemodNames = t.TypeOf<typeof codemodNamesCodec>;
export type PrivateCodemodEntry = t.TypeOf<typeof privateCodemodEntryCodec>;
