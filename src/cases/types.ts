import type { JobHash } from '../jobs/types';
import { buildTypeCodec } from '../utilities';
import * as t from 'io-ts';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export const enum CaseKind {
	REWRITE_FILE_BY_NORA_NODE_ENGINE = 2,
}

export const caseCodec =  buildTypeCodec({
	kind: t.literal(CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE),
	subKind: t.string,
	hash: t.string,
	codemodSetName: t.string,
	codemodName: t.string,
});

export type Case = t.TypeOf<typeof caseCodec>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
