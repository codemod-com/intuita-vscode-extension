import * as t from 'io-ts';

export const recipeNameCodec = t.union([
	t.literal('nextJs'),
	t.literal('next_13_composite'),
	t.literal('mui'),
	t.literal('react-redux_0'),
	t.literal('reactrouterv4'),
	t.literal('reactrouterv6'),
	t.literal('immutablejsv4'),
	t.literal('immutablejsv0'),
	t.literal('redwoodjs_core_4'),
	t.literal('redwoodjs_experimental'),
]);

export type RecipeName = t.TypeOf<typeof recipeNameCodec>;

export const RECIPE_NAMES = recipeNameCodec.types.map((type) => type.value);
