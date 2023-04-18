import { Case } from './types';

export const buildCaseName = (kase: Case): string => {
	return `${kase.hash}_${kase.codemodName}`;
};
