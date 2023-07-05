import { randomBytes } from 'node:crypto';
import type { CaseHash } from '../cases/types';

export const buildExecutionId = (): CaseHash => {
	const buffer = randomBytes(2);
	const uint = buffer.readInt16BE();

	return String(uint) as CaseHash;
};
