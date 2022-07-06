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
}>;

export const buildHash = (data: string) =>
    createHash('ripemd160')
        .update(data)
        .digest('base64url');