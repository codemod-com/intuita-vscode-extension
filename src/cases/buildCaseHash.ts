import { JobHash } from '../jobs/types';
import { buildHash } from '../utilities';
import type { CaseHash, CaseKind } from './types';

export const buildCaseHash = (
	kind: CaseKind,
	code: string | null,
	jobHash: JobHash | null,
): CaseHash =>
	buildHash([kind, code ?? '', jobHash ?? ''].join(',')) as CaseHash;
