import type { CaseHash } from '../cases/types';
import { buildHash } from '../utilities';
import type { DiagnosticElement, ElementHash, FileElement } from './types';

export const buildFileElement = (
	caseHash: CaseHash,
	label: string,
	children: ReadonlyArray<DiagnosticElement>,
): FileElement => {
	const count = children.length;

	return {
		kind: 'FILE' as const,
		label: `${label} (${count})`,
		children,
		hash: buildHash(`${caseHash}${label}`) as ElementHash,
	};
};
