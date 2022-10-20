// the [T] is intentional (for distributive types)
import { createHash } from 'crypto';
import type { Range } from 'vscode';

type NeitherNullNorUndefined<T> = [T] extends null | undefined ? never : T;

export type IntuitaPosition = Readonly<[number, number]>;
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

export const moveElementInArray = <T>(
	array: ReadonlyArray<NonNullable<T>>,
	oldIndex: number,
	newIndex: number,
): ReadonlyArray<NonNullable<T>> => {
	const element = array[oldIndex];

	if (!isNeitherNullNorUndefined(element)) {
		return array;
	}

	const newArray = array.slice();

	newArray.splice(oldIndex, 1);
	newArray.splice(newIndex, 0, element);

	return newArray;
};

export const calculateAverage = (array: ReadonlyArray<number>): number => {
	if (array.length === 0) {
		return 0;
	}

	const sum = array.reduce((a, b) => a + b, 0);

	return sum / array.length;
};

export const calculateLines = (
	text: string,
	separator: string,
): ReadonlyArray<string> => text.split(separator);

export const calculateLengths = (lines: ReadonlyArray<string>) =>
	lines.map((line) => line.length);

export const calculateCharacterIndex = (
	separator: string,
	lengths: ReadonlyArray<number>,
	lineNumber: number,
	characterNumber: number,
): number => {
	return lengths
		.slice(0, lineNumber)
		.reduce((a, b) => a + b + separator.length, characterNumber);
};

export const calculatePosition = (
	separator: string,
	lengths: ReadonlyArray<number>,
	characterIndex: number,
): Readonly<[number, number]> => {
	let currentCharacterIndex = characterIndex;

	for (let line = 0; line < lengths.length; ++line) {
		const length = lengths[line] ?? 0;

		if (currentCharacterIndex <= length) {
			return [line, currentCharacterIndex];
		}

		currentCharacterIndex -= length + separator.length;
	}

	return [0, 0];
};

export const calculateLastPosition = (
	text: string,
	separator: string,
): IntuitaPosition => {
	const lines = text.split(separator);

	const lastLineNumber = lines.length - 1;
	const lastCharacter = lines[lines.length - 1]?.length ?? 0;

	return [lastLineNumber, lastCharacter];
};

export const getSeparator = (text: string): string => {
	return text.includes('\r\n') ? '\r\n' : '\n';
};

export const buildIntuitaRange = (range: Range): IntuitaRange => [
	range.start.line,
	range.start.character,
	range.end.line,
	range.end.character,
];

export const buildIntuitaSimpleRange = (
	separator: string,
	lengths: ReadonlyArray<number>,
	range: IntuitaRange,
): IntuitaSimpleRange => {
	const start = calculateCharacterIndex(
		separator,
		lengths,
		range[0],
		range[1],
	);

	const end = calculateCharacterIndex(separator, lengths, range[2], range[3]);

	return {
		start,
		end,
	};
};
