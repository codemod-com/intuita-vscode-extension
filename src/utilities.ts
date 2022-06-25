// the [T] is intentional (for distributive types)
type NeitherNullNorUndefined<T> = [T] extends null | undefined ? never : T;

export function isNeitherNullNorUndefined<T>(
    value: NeitherNullNorUndefined<T> | null | undefined
): value is NeitherNullNorUndefined<T> {
    return value !== null && value !== undefined;
}
