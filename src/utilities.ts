// the [T] is intentional (for distributive types)
import { createHash } from 'crypto';

type NeitherNullNorUndefined<T> = [T] extends null | undefined ? never : T;

export type IntuitaRange = Readonly<[number, number, number, number]>;

export type IntuitaSimpleRange = Readonly<{ start: number; end: number }>;

export function isNeitherNullNorUndefined<T>(
	value: NeitherNullNorUndefined<T> | null | undefined,
): value is NeitherNullNorUndefined<T> {
	return value !== null && value !== undefined;
}

export function assertsNeitherNullOrUndefined<T>(
	value: NeitherNullNorUndefined<T> | null | undefined,
): asserts value is NeitherNullNorUndefined<T> {
	if (value === null || value === undefined) {
		throw new Error('The value cannot be null or undefined');
	}
}

export const buildHash = (data: string) =>
	createHash('ripemd160').update(data).digest('base64url');

export const compareIntuitaRange = (
	left: IntuitaRange,
	right: IntuitaRange,
): number => {
	const lineComparison = left[0] - right[0];

	if (lineComparison !== 0) {
		return lineComparison;
	}

	return left[1] - right[1];
};
