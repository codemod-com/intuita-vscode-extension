import { format, resolveConfig, Options } from 'prettier';

const DEFAULT_PRETTIER_OPTIONS: Options = {
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

export const getConfig = async (path: string): Promise<Options> => {
	try {
		const config = await resolveConfig(path);

		if (config === null || Object.keys(config).length === 0) {
			return DEFAULT_PRETTIER_OPTIONS;
		}

		const parser = path.endsWith('.css')
			? 'css'
			: config.parser ?? DEFAULT_PRETTIER_OPTIONS.parser;

		return {
			...config,
			parser,
		};
	} catch (error) {
		return DEFAULT_PRETTIER_OPTIONS;
	}
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
