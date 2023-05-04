import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export const enum CaseKind {
	REWRITE_FILE_BY_NORA_NODE_ENGINE = 2,
}

export type Case = Readonly<{
	kind: CaseKind;
	subKind: string;
	hash: CaseHash;
	codemodSetName: string;
	codemodName: string;
}>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
