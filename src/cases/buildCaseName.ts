import { randomBytes } from 'node:crypto';
import { Case } from './types';

export const buildCaseName = (kase: Case): string => {
	return `${kase.subKind}_${randomBytes(16).toString('hex')}`;
};
