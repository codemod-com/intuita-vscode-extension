import type { Node } from 'typescript';
import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export const enum CaseKind {
	MOVE_TOP_LEVEL_BLOCKS = 1,
	REPAIR_CODE_BY_TSC,
	REPAIR_CODE_BY_POLYGLOT_PIRANHA,
}

export const enum RepairCodeByTscCaseSubKind {
	OTHER = 1,
	TS2322_NEXTJS_IMAGE_LAYOUT,
	TS2345_PRIMITIVES,
	TS2741_NEXTJS_IMAGE_ALT,
	TS2769_OBJECT_ASSIGN,
}

export type Case =
	| Readonly<{
			hash: CaseHash;
			kind: CaseKind.MOVE_TOP_LEVEL_BLOCKS;
	  }>
	| Readonly<{
			hash: CaseHash;
			kind: CaseKind.REPAIR_CODE_BY_TSC;
			subKind: RepairCodeByTscCaseSubKind;
			code: string;
			node: Node;
	  }>
	| Readonly<{
			hash: CaseHash;
			kind: CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA;
			// to be continued
	  }>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
