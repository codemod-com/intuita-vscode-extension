import type { Node } from 'typescript';
import type { JobHash } from '../jobs/types';

export type CaseHash = string & { readonly __CaseHash: '__CaseHash' };

export const enum CaseKind {
	MOVE_TOP_LEVEL_BLOCKS = 1,
	REPAIR_CODE_BY_TSC,
	REPAIR_CODE_BY_POLYGLOT_PIRANHA,
	REWRITE_FILE_BY_NORA_NODE_ENGINE,
}

export const enum RepairCodeByTscCaseSubKind {
	OTHER = 1,
	TS2322_NEXT_JS_IMAGE_LAYOUT,
	TS2345_PRIMITIVES,
	TS2741_NEXT_JS_IMAGE_ALT,
	TS2769_OBJECT_ASSIGN,
}

export const enum RepairCodeByPolyglotPiranhaCaseSubKind {
	NEXT_JS_LINK = 1,
	NEXT_JS_IMAGE,
}

export const enum RewriteFileByNoraNodeEngineCaseSubKind {
	NEXT_JS_LINK = 1,
	NEXT_JS_IMAGE,
	NEXT_JS_REACT_IMPORT,
}

export type Case =
	| Readonly<{
			kind: CaseKind.MOVE_TOP_LEVEL_BLOCKS;
			hash: CaseHash;
	  }>
	| Readonly<{
			kind: CaseKind.REPAIR_CODE_BY_TSC;
			subKind: RepairCodeByTscCaseSubKind;
			hash: CaseHash;
			code: string;
			node: Node;
	  }>
	| Readonly<{
			kind: CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA;
			subKind: RepairCodeByPolyglotPiranhaCaseSubKind;
			hash: CaseHash;
	  }>
	| Readonly<{
			kind: CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE;
			subKind: RewriteFileByNoraNodeEngineCaseSubKind;
			hash: CaseHash;
	}>;

export type CaseWithJobHashes = Case &
	Readonly<{
		jobHashes: ReadonlySet<JobHash>;
	}>;
