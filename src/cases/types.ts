import type { Node } from 'typescript';
import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export enum CaseKind {
	OTHER = 1,
	MOVE_TOP_LEVEL_BLOCKS,
	TS2322_NEXTJS_IMAGE_LAYOUT,
	TS2345_PRIMITIVES,
	TS2741_NEXTJS_IMAGE_ALT,
	TS2769_OBJECT_ASSIGN,
}

export type Case = Readonly<{
	hash: CaseHash;
	kind: CaseKind;
	code: string | null;
	node: Node;
}>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
