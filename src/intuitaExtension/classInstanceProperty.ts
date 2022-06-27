export const enum ClassInstancePropertyKind {
    PARAMETER = 1, // defined in the constructor
    PROPERTY = 2, // defined in the body
    GETTER = 2,
    SETTER = 3,
}

export type ClassInstanceProperty =
    | Readonly<{
        kind: ClassInstancePropertyKind.PROPERTY,
        name: string,
        initializer: string | null,
        readonly: boolean,
        methodNames: ReadonlyArray<string>,
    }>;
