import type { DiagnosticElement, RootElement } from './types';

export const getFirstDiagnosticElement = (
	rootElement: RootElement,
): DiagnosticElement | null => {
	const firstCaseElement = rootElement.children[0];

	if (!firstCaseElement) {
		return null;
	}

	const firstFileElement = firstCaseElement.children[0];

	if (!firstFileElement) {
		return null;
	}

	return firstFileElement.children[0] ?? null;
};
