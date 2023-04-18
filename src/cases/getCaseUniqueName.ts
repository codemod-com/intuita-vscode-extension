import { Case } from './types';

export const getCaseUniqueName = (kase: Case): string => {
	return `${kase.hash}_${kase.codemodName}`;
};
