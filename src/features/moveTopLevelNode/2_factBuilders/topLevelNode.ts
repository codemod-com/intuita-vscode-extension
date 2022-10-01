export const enum TopLevelNodeModifier {
	import = 'import',
	defaultExport = 'default',
	export = 'export',
	none = 'none',
}

export const DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER: ReadonlyArray<TopLevelNodeModifier> =
	[
		TopLevelNodeModifier.import,
		TopLevelNodeModifier.defaultExport,
		TopLevelNodeModifier.export,
		TopLevelNodeModifier.none,
	];

export const enum TopLevelNodeKind {
	import = 'import',
	enum = 'enum',
	type = 'type',
	interface = 'interface',
	constVariable = 'constVariable',
	letVariable = 'letVariable',
	constArrowFunction = 'constArrowFunction',
	letArrowFunction = 'letArrowFunction',
	function = 'function',
	class = 'class',
	multipleVariables = 'multipleVariables',
	block = 'block',
	export = 'export',
	unknown = 'unknown',
}

export const DEFAULT_TOP_LEVEL_NODE_KIND_ORDER: ReadonlyArray<TopLevelNodeKind> =
	[
		TopLevelNodeKind.import,
		TopLevelNodeKind.enum,
		TopLevelNodeKind.type,
		TopLevelNodeKind.interface,
		TopLevelNodeKind.constVariable,
		TopLevelNodeKind.letVariable,
		TopLevelNodeKind.constArrowFunction,
		TopLevelNodeKind.letArrowFunction,
		TopLevelNodeKind.function,
		TopLevelNodeKind.class,
		TopLevelNodeKind.multipleVariables,
		TopLevelNodeKind.block,
		TopLevelNodeKind.export,
		TopLevelNodeKind.unknown,
	];

export type TopLevelNode = Readonly<{
	kind: TopLevelNodeKind;
	modifier: TopLevelNodeModifier;
	id: string;
	triviaStart: number;
	triviaEnd: number;
	nodeStart: number;
	nodeEnd: number;
	identifiers: ReadonlySet<string>;
	childIdentifiers: ReadonlySet<string>;
	heritageIdentifiers: ReadonlySet<string>;
}>;

export const enum TriviaNodeKind {
	COMMENT = 1,
	NEW_LINE = 2,
}

export type TriviaNode = Readonly<{
	kind: TriviaNodeKind.COMMENT | TriviaNodeKind.NEW_LINE;
	start: number;
	end: number;
}>;
