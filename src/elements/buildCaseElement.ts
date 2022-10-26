import { Case, CaseKind } from '../cases/types';
import type { CaseElement, ElementHash, FileElement } from './types';

const buildLabel = (kase: Case): string => {
	switch (kase.kind) {
		case CaseKind.MOVE_TOP_LEVEL_BLOCKS:
			return 'Case: Move Top-Level Blocks';
		case CaseKind.TS2769_OBJECT_ASSIGN:
			return 'Case: TS2769 with Object.assign';
		default:
			return `Case: TS${kase.code}`;
	}
};

export const buildCaseElement = (
	kase: Case,
	children: ReadonlyArray<FileElement>,
): CaseElement => ({
	kind: 'CASE',
	label: buildLabel(kase),
	children,
	hash: kase.hash as unknown as ElementHash,
});
