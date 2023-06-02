import { randomBytes } from 'node:crypto';

export const buildExecutionId = (): string => {
	const buffer = randomBytes(2);
	const uint = buffer.readInt16BE();

	return String(uint);
};
