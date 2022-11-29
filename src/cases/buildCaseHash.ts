import { buildHash } from '../utilities';
import { Case, CaseHash } from './types';

export const buildCaseHash = (kase: Omit<Case, 'hash'>): CaseHash => {
	return buildHash([kase.kind, kase.subKind].join(',')) as CaseHash;
};
