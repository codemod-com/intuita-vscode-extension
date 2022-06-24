export function isNeitherNullNorUndefined<T>(
    value: NonNullable<T> | null | undefined
): value is NonNullable<T> {
    return value !== null && value !== undefined;
}
