import { buildHash } from '../utilities';
import { Case, CaseHash } from './types';

export const buildCaseHash = (kase: Pick<Case, 'kind' | 'subKind'>): CaseHash => {
	return buildHash([kase.kind, kase.subKind].join(',')) as CaseHash;
};
