import type { Node } from 'typescript';
import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export enum CaseKind {
	OTHER = 1,
	TS2769_OBJECT_ASSIGN = 2,
	MOVE_TOP_LEVEL_BLOCKS = 3,
}

export type Case = Readonly<{
	hash: CaseHash;
	kind: CaseKind;
	code: string | null;
	node: Node;
}>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlyArray<JobHash>;
	}>;
