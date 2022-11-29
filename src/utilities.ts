import { createHash } from 'crypto';

export type IntuitaRange = Readonly<[number, number, number, number]>;

export function isNeitherNullNorUndefined<T>(
	value: T
): value is (T & {}) {
	return value !== null && value !== undefined;
}

export function assertsNeitherNullOrUndefined<T>(
	value: T,
): asserts value is  (T & {}) {
	if (value === null || value === undefined) {
		throw new Error('The value cannot be null or undefined');
	}
}

export const buildHash = (data: string) =>
	createHash('ripemd160').update(data).digest('base64url');
