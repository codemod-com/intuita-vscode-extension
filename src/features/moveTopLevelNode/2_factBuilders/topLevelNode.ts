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
    triviaStart: number,
    triviaEnd: number,
    nodeStart: number,
    nodeEnd: number,
    identifiers: ReadonlySet<string>,
    childIdentifiers: ReadonlySet<string>,
}>;

export const enum TriviaNodeKind {
    COMMENT = 1,
    NEW_LINE = 2
}

export type TriviaNode = Readonly<{
    kind: TriviaNodeKind.COMMENT | TriviaNodeKind.NEW_LINE,
    start: number,
    end: number,
}>;