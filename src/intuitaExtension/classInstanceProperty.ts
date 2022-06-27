export const enum ClassInstancePropertyKind {
    PARAMETER = 1, // defined in the constructor
    PROPERTY = 2, // defined in the body
    GETTER = 3,
    SETTER = 4,
}

export type ClassInstanceProperty =
    | Readonly<{
        kind: ClassInstancePropertyKind.PROPERTY,
        name: string,
        initializer: string | null,
        readonly: boolean,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: ClassInstancePropertyKind.GETTER,
        name: string,
        bodyText: string | null,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: ClassInstancePropertyKind.SETTER,
        name: string,
        bodyText: string | null,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
    }>
;
