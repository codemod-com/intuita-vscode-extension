import type { UriHash } from '../uris/types';
import {
	buildHash,
	buildIntuitaRange,
	buildIntuitaSimpleRange,
	calculateLengths,
	calculateLines,
	getSeparator,
} from '../utilities';
import { VscodeDiagnostic } from '../vscode/types';
import { stringifyCode } from './stringifyCode';
import type { DiagnosticHash, DiagnosticHashIngredients } from './types';

export const buildDiagnosticHashIngredients = (
	uriHash: UriHash,
	diagnostic: VscodeDiagnostic,
	fileText: string,
): DiagnosticHashIngredients => {
	const separator = getSeparator(fileText);
	const lines = calculateLines(fileText, separator);
	const lengths = calculateLengths(lines);

	const range = buildIntuitaSimpleRange(
		separator,
		lengths,
		buildIntuitaRange(diagnostic.range),
	);

	const code = stringifyCode(diagnostic.code);

	const rangeText = fileText.slice(range.start, range.end);

	return {
		uriHash,
		range,
		code,
		message: diagnostic.message,
		rangeText,
	};
};

export const buildDiagnosticHash = (
	ingredients: DiagnosticHashIngredients,
): DiagnosticHash => {
	if ('jobHash' in ingredients) {
		return ingredients.jobHash as unknown as DiagnosticHash;
	}

	return buildHash(
		[
			ingredients.uriHash,
			String(ingredients.range.start),
			String(ingredients.range.end),
			ingredients.code,
			ingredients.message,
			ingredients.rangeText,
		].join(','),
	) as DiagnosticHash;
};
