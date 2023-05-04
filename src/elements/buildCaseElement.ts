import { Case } from '../cases/types';
import { CaseElement, ElementHash, ElementKind, FileElement } from './types';

export const buildCaseElement = (
	kase: Case,
	children: ReadonlyArray<FileElement>,
): CaseElement => {
	const count = children
		.map((fileElement) => fileElement.children.length)
		.reduce((a, b) => a + b, 0);

	return {
		kind: ElementKind.CASE,
		label: `${kase.subKind} (${count})`,
		children,
		hash: kase.hash as unknown as ElementHash,
		codemodName: kase.codemodName,
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
