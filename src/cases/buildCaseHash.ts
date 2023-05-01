import { buildHash } from '../utilities';
import { Case, CaseHash } from './types';

export const buildCaseHash = (
	kase: Pick<Case, 'kind' | 'subKind'>,
	executionId: string,
): CaseHash => {
	return buildHash(
		[executionId, kase.kind, kase.subKind].join(','),
	) as CaseHash;
};
