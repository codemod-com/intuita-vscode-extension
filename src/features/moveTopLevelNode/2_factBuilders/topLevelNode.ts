export const enum TopLevelNodeModifier {
    import = 'import',
    defaultExport = 'default',
    export = 'export',
    none = 'none',
}

export const enum TopLevelNodeKind {
    import = 'import',
    // exportClass = 'exportClass',
    class = 'class',
    // exportType = 'exportType',
    type = 'type',
    // exportInterface = 'exportInterface',
    interface = 'interface',
    // exportEnum = 'exportEnum',
    enum = 'enum',
    // exportFunction = 'exportFunction',
    function = 'function',
    // exportManyVariables = 'exportManyVariables',
    multipleVariables = 'multipleVariables',
    // exportConstArrowFunction = 'exportConstArrowFunction',
    constArrowFunction = 'constArrowFunction',
    // exportLetArrowFunction = 'exportLetArrowFunction',
    letArrowFunction = 'letArrowFunction',
    // exportConstVariable = 'exportConstVariable',
    constVariable = 'constVariable',
    // exportLetVariable = 'exportLetVariable',
    letVariable = 'letVariable',
    block = 'block',
    // unknown = 'unknown',
    // exportAssignment = 'defaultExport',
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
    modifier: TopLevelNodeModifier,
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