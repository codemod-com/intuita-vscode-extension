import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export const enum CaseKind {
	REWRITE_FILE_BY_POLYGLOT_PIRANHA,
	REWRITE_FILE_BY_NORA_NODE_ENGINE,
}

export type Case = Readonly<{
	kind: CaseKind.REWRITE_FILE_BY_POLYGLOT_PIRANHA | CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE;
	subKind: string;
	hash: CaseHash;
}>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
