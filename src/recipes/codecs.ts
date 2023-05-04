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

export const projectNameCodec = t.union([
	t.literal('Next.js'),
	t.literal('MUI'),
	t.literal('React Redux'),
	t.literal('React Router'),
	t.literal('Immutable.js'),
	t.literal('RedwoodJS'),
]);
export type ProjectName = t.TypeOf<typeof projectNameCodec>;
export const PROJECT_NAMES = projectNameCodec.types.map((type) => type.value);

export const RECIPE_MAP: Map<ProjectName, Record<string, RecipeName>> = new Map(
	PROJECT_NAMES.map((projectName: ProjectName) => {
		let versionMap: Record<string, RecipeName>;
		switch (projectName) {
			case 'Next.js':
				versionMap = {
					'13': 'nextJs',
					Composite: 'next_13_composite',
				};
				break;
			case 'MUI':
				versionMap = { '5': 'mui' };
				break;
			case 'React Redux':
				versionMap = { '0': 'react-redux_0' };
				break;
			case 'React Router':
				versionMap = { '4': 'reactrouterv4', '6': 'reactrouterv6' };
				break;
			case 'Immutable.js':
				versionMap = { '0': 'immutablejsv0', '4': 'immutablejsv4' };
				break;
			case 'RedwoodJS':
				versionMap = {
					'4': 'redwoodjs_core_4',
					Experimental: 'redwoodjs_experimental',
				};
				break;
		}
		return [projectName, versionMap];
	}),
);
