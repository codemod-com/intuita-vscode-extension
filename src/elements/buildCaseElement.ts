import { Case, CaseKind } from '../cases/types';
import type { CaseElement, ElementHash, FileElement } from './types';

const buildLabelHeader = (kase: Case): string => {
	switch (kase.kind) {
		case CaseKind.MOVE_TOP_LEVEL_BLOCKS:
			return 'Case: Move Top-Level Blocks';
		case CaseKind.TS2769_OBJECT_ASSIGN:
			return `Case: TS${kase.code} Object.assign`;
		case CaseKind.TS2322_NEXTJS_IMAGE_LAYOUT:
			return `Case: TS${kase.code} Next.js Image Component Layout Attribute`;
		case CaseKind.TS2741_NEXTJS_IMAGE_ALT:
			return `Case: TS${kase.code} Next.js Image Component Alt Attribute`;
		case CaseKind.TS2345_PRIMITIVES:
			return `Case: TS${kase.code} Primitives`;
		default:
			return `Case: TS${kase.code}`;
	}
};

export const buildCaseElement = (
	kase: Case,
	children: ReadonlyArray<FileElement>,
): CaseElement => ({
	kind: 'CASE',
	label: `${buildLabelHeader(kase)} (${children.length})`,
	children,
	hash: kase.hash as unknown as ElementHash,
});
