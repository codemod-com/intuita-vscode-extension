import type { CaseHash } from '../cases/types';
import { buildHash } from '../utilities';
import type { JobElement, ElementHash, FileElement } from './types';

export const buildFileElement = (
	caseHash: CaseHash,
	label: string,
	children: ReadonlyArray<JobElement>,
): FileElement => {
	const count = children.length;

	return {
		kind: 'FILE' as const,
		label: `${label} (${count})`,
		children,
		hash: buildHash(`${caseHash}${label}`) as ElementHash,
	};
};

export const compareFileElements = (
	left: FileElement,
	right: FileElement,
): number => {
	const childrenLength = right.children.length - left.children.length;

	if (childrenLength !== 0) {
		return childrenLength;
	}

	return left.label.localeCompare(right.label);
}