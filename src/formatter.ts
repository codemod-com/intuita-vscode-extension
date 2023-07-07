import { format, resolveConfig, Options } from 'prettier';

export const DEFAULT_PRETTIER_OPTIONS: Options = {
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
	quoteProps: 'as-needed',
	trailingComma: 'all',
	bracketSpacing: true,
	arrowParens: 'always',
	endOfLine: 'lf',
	parser: 'typescript',
};

export const getConfig = async (
	path: string,
	configPath: string | null,
): Promise<Options> => {
	const config = await resolveConfig(path, {
		editorconfig: false,
		...(configPath && { config: configPath }),
	});

	if (config === null || Object.keys(config).length === 0) {
		throw new Error('Unable to resolve config');
	}

	const parser = path.endsWith('.css')
		? 'css'
		: config.parser ?? DEFAULT_PRETTIER_OPTIONS.parser;

	return {
		...config,
		parser,
	};
};

export const formatText = async (
	data: string,
	options: Options,
): Promise<string> => {
	try {
		return format(data, options);
	} catch (err) {
		return data;
	}
};
