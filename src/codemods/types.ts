import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';

export type CodemodEntry = t.TypeOf<typeof codemodEntryCodec>;

export const codemodEntryCodec = buildTypeCodec({
	kind: t.literal('codemod'),
	hashDigest: t.string,
	name: t.string,
	description: t.string,
	engine: t.union([
		t.literal('jscodeshift'),
		t.literal('ts-morph'),
		t.literal('repomod-engine'),
		t.literal('filemod-engine'),
	]),
});
