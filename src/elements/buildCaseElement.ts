import { Case } from '../cases/types';
import type { CaseElement, ElementHash, FileElement } from './types';

const buildLabelHeader = (kase: Case): string => `Case: ${kase.subKind}`;

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
