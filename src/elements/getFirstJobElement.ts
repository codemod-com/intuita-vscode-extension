import type { JobElement, RootElement } from './types';

export const getFirstJobElement = (
	rootElement: RootElement,
): JobElement | null => {
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
