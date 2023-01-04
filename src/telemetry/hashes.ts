import { randomBytes } from 'node:crypto';

export const buildSessionId = (): string => {
	const buffer = randomBytes(8);

	const bigUint = buffer.readBigInt64BE();

	return String(bigUint);
};

export const buildExecutionId = (): string => {
	const buffer = randomBytes(2);
	const uint = buffer.readInt16BE();

	return String(uint);
};
