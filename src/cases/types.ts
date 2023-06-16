import type { JobHash } from '../jobs/types';
import { buildTypeCodec } from '../utilities';
import * as t from 'io-ts';

interface CaseHashBrand {
	readonly __CaseHash: unique symbol;
}

export const enum CaseKind {
	REWRITE_FILE_BY_NORA_NODE_ENGINE = 2,
}

export const caseCodec = buildTypeCodec({
	kind: t.literal(CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE),
	subKind: t.string,
	hash: t.brand(
		t.string,
		(hashDigest): hashDigest is t.Branded<string, CaseHashBrand> =>
			hashDigest.length > 0,
		'__CaseHash',
	),
	codemodSetName: t.string,
	codemodName: t.string,
});

export type Case = t.TypeOf<typeof caseCodec>;

export type CaseHash = Case['hash'];

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
