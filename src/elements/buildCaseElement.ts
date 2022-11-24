import {
	Case,
	CaseKind,
	RepairCodeByPolyglotPiranhaCaseSubKind,
	RepairCodeByTscCaseSubKind,
	RewriteFileByNoraNodeEngineCaseSubKind,
} from '../cases/types';
import type { CaseElement, ElementHash, FileElement } from './types';

const buildLabelHeader = (kase: Case): string => {
	switch (kase.kind) {
		case CaseKind.MOVE_TOP_LEVEL_BLOCKS:
			return 'Case: Move Top-Level Blocks';
		case CaseKind.REPAIR_CODE_BY_TSC: {
			switch (kase.subKind) {
				case RepairCodeByTscCaseSubKind.TS2769_OBJECT_ASSIGN:
					return `Case: TS${kase.code} Object.assign`;
				case RepairCodeByTscCaseSubKind.TS2322_NEXT_JS_IMAGE_LAYOUT:
					return `Case: TS${kase.code} Next.js Image Component Layout Attribute`;
				case RepairCodeByTscCaseSubKind.TS2741_NEXT_JS_IMAGE_ALT:
					return `Case: TS${kase.code} Next.js Image Component Alt Attribute`;
				case RepairCodeByTscCaseSubKind.TS2345_PRIMITIVES:
					return `Case: TS${kase.code} Primitives`;
				default:
					return `Case: TS${kase.code}`;
			}
		}
		case CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA: {
			switch (kase.subKind) {
				case RepairCodeByPolyglotPiranhaCaseSubKind.NEXT_JS_IMAGE:
					return 'Case: Repair Next.js Images';
				case RepairCodeByPolyglotPiranhaCaseSubKind.NEXT_JS_LINK:
					return 'Case: Repair Next.js Links';
			}
		}
		case CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE: {
			switch(kase.subKind) {
				case RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_IMAGE:
					return 'Case: Next.js Images';
				case RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_LINK:
					return 'Case: Next.js Links';
				case RewriteFileByNoraNodeEngineCaseSubKind.NEXT_JS_REACT_IMPORT:
					return 'Case: Next.js React.js Imports';
			}
		}
	}
};

export const buildCaseElement = (
	kase: Case,
	children: ReadonlyArray<FileElement>,
): CaseElement => {
	const count = children
		.map((fileElement) => fileElement.children.length)
		.reduce((a, b) => a + b, 0);

	return {
		kind: 'CASE',
		label: `${buildLabelHeader(kase)} (${count})`,
		children,
		hash: kase.hash as unknown as ElementHash,
	};
};

export const compareCaseElements = (
	left: CaseElement,
	right: CaseElement,
): number => {
	const childrenLength = right.children.length - left.children.length;

	if (childrenLength !== 0) {
		return childrenLength;
	}

	return left.label.localeCompare(right.label);
};
