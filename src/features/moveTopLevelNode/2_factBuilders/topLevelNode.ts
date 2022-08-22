export const enum TopLevelNodeKind {
    unknown = 'unknown',
    class = 'class',
    function = 'function',
    interface = 'interface',
    typeAlias = 'typeAlias',
    block = 'block',
    variable = 'variable',
    enum = 'enum',
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
    heritageIdentifiers: ReadonlySet<string>,
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