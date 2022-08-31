export const enum TopLevelNodeKind {
    importDeclaration = 'import',
    unknown = 'unknown',
    class = 'class',
    function = 'function',
    interface = 'interface',
    typeAlias = 'typeAlias',
    block = 'block',
    variable = 'variable',
    enum = 'enum',
    exportAssignment = 'defaultExport',
}

export const DEFAULT_TOP_LEVEL_NODE_KIND_ORDER: ReadonlyArray<TopLevelNodeKind> = [
    TopLevelNodeKind.importDeclaration,
    TopLevelNodeKind.enum,
    TopLevelNodeKind.typeAlias,
    TopLevelNodeKind.interface,
    TopLevelNodeKind.function,
    TopLevelNodeKind.class,
    TopLevelNodeKind.block,
    TopLevelNodeKind.variable,
    TopLevelNodeKind.unknown,
    TopLevelNodeKind.exportAssignment,
];

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