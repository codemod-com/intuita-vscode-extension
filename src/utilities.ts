// the [T] is intentional (for distributive types)
import {createHash} from "crypto";

type NeitherNullNorUndefined<T> = [T] extends null | undefined ? never : T;

export function isNeitherNullNorUndefined<T>(
    value: NeitherNullNorUndefined<T> | null | undefined
): value is NeitherNullNorUndefined<T> {
    return value !== null && value !== undefined;
}

export type SourceFileExecution = Readonly<{
    name: string,
    text: string,
    line: number,
    character: number,
}>;

export const buildHash = (data: string) =>
    createHash('ripemd160')
        .update(data)
        .digest('base64url');

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

export const calculateAverage = (
    array: ReadonlyArray<number>
): number => {
    if (array.length === 0) {
        return 0;
    }

    const sum = array
        .reduce((a, b) => a + b, 0);

    return sum / array.length;
};

export const calculateLines = (
    text: string,
    separator: string,
) =>
    text.split(separator);

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
        .reduce(
            (a, b) => a+b+separator.length,
            characterNumber,
        );
};

export const calculatePosition = (
    separator: string,
    lengths: ReadonlyArray<number>,
    characterIndex: number,
): Readonly<[number, number]> => {
    let currentCharacterIndex = characterIndex;

    for(let line = 0; line < lengths.length; ++line) {
        const length = lengths[line] ?? 0;

        if (currentCharacterIndex <= length) {
            return [
                line,
                currentCharacterIndex,
            ];
        }

        currentCharacterIndex -= (length + separator.length);
    }

    return [0, 0];
};