export const enum Mutability {
    READING_READONLY = 1,
    READING_WRITABLE = 2, // for future use
    WRITING_WRITABLE = 3,
}

export const concatMutabilities = (
    mutabilities: ReadonlyArray<Mutability>
): Mutability => {
    return mutabilities.every((m) => m === Mutability.READING_READONLY)
        ? Mutability.READING_READONLY
        : Mutability.WRITING_WRITABLE;
};