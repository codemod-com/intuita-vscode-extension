export const enum TopLevelNodeKind {
    UNKNOWN = 1,
    CLASS = 2,
    FUNCTION = 3,
    INTERFACE = 4,
    TYPE_ALIAS = 5,
    BLOCK = 6,
    VARIABLE = 7,
    ENUM = 8,
}

export type TopLevelNode = Readonly<{
    kind: TopLevelNodeKind,
    id: string,
    start: number,
    end: number,
    identifiers: ReadonlySet<string>,
    childIdentifiers: ReadonlySet<string>,
}>;