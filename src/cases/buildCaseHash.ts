import { JobHash } from '../jobs/types';
import { buildHash } from '../utilities';
import { Case, CaseHash, CaseKind } from './types';

export const buildCaseHash = (
	kase:
		| Omit<Case & { kind: CaseKind.MOVE_TOP_LEVEL_BLOCKS }, 'hash'>
		| Omit<
				Case & { kind: CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA },
				'hash'
		  >
		| Omit<Case & { kind: CaseKind.REPAIR_CODE_BY_TSC }, 'hash'>
		| Omit<Case & { kind: CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE }, 'hash'>,
	jobHash: JobHash | null,
): CaseHash => {
	switch (kase.kind) {
		case CaseKind.MOVE_TOP_LEVEL_BLOCKS:
			return buildHash([kase.kind].join(',')) as CaseHash;
		case CaseKind.REPAIR_CODE_BY_POLYGLOT_PIRANHA:
			return buildHash([kase.kind, kase.subKind].join(',')) as CaseHash;
		case CaseKind.REPAIR_CODE_BY_TSC:
			return buildHash(
				[kase.kind, kase.subKind, kase.code, jobHash ?? ''].join(','),
			) as CaseHash;
		case CaseKind.REWRITE_FILE_BY_NORA_NODE_ENGINE:
			return buildHash(
				[kase.kind, kase.subKind].join(','),
				) as CaseHash;
	}
};
