import * as t from 'io-ts';
import { createHash } from 'crypto';

export type IntuitaRange = Readonly<[number, number, number, number]>;

export function isNeitherNullNorUndefined<T>(
	value: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): value is T & {} {
	return value !== null && value !== undefined;
}

export function assertsNeitherNullOrUndefined<T>(
	value: T,
	// eslint-disable-next-line @typescript-eslint/ban-types
): asserts value is T & {} {
	if (value === null || value === undefined) {
		throw new Error('The value cannot be null or undefined');
	}
}

export const buildHash = (data: string) =>
	createHash('ripemd160').update(data).digest('base64url');

export const buildTypeCodec = <T extends t.Props>(
	props: T,
): t.ReadonlyC<t.ExactC<t.TypeC<T>>> => t.readonly(t.exact(t.type(props)));