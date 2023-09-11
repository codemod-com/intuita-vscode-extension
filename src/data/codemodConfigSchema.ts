import * as S from '@effect/schema/Schema';

export const argumentsSchema = S.array(
	S.union(
		S.struct({
			name: S.string,
			kind: S.literal('string'),
			default: S.union(S.string, S.undefined),
		}),
		S.struct({
			name: S.string,
			kind: S.literal('number'),
			default: S.union(S.number, S.undefined),
		}),
		S.struct({
			name: S.string,
			kind: S.literal('boolean'),
			default: S.union(S.boolean, S.undefined),
		}),
		// S.struct({
		// 	name: S.string,
		// 	kind: S.literal('selection'),
		// 	description: S.string,
		// 	options: S.array(S.string),
		// 	default: S.union(S.string, S.undefined),
		// }),
	),
);

export const codemodConfigSchema = S.union(
	S.struct({
		schemaVersion: S.literal('1.0.0'),
		engine: S.literal('piranha'),
		language: S.literal('java'),
		arguments: S.optional(argumentsSchema),
	}),
	S.struct({
		schemaVersion: S.literal('1.0.0'),
		engine: S.literal('jscodeshift'),
		arguments: S.optional(argumentsSchema),
	}),
	S.struct({
		schemaVersion: S.literal('1.0.0'),
		engine: S.literal('ts-morph'),
		arguments: S.optional(argumentsSchema),
	}),
	S.struct({
		schemaVersion: S.literal('1.0.0'),
		engine: S.literal('repomod-engine'),
		arguments: S.optional(argumentsSchema),
	}),
	S.struct({
		schemaVersion: S.literal('1.0.0'),
		engine: S.literal('recipe'),
		names: S.array(S.string),
		arguments: S.optional(argumentsSchema),
	}),
);

export const parseCodemodConfigSchema = S.parseSync(codemodConfigSchema);

export type CodemodConfig = S.To<typeof codemodConfigSchema>;
