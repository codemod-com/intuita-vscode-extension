import { Case } from './types';

export const buildCaseName = (kase: Case): string => {
	return `${kase.subKind}_${kase.hash}`;
};
