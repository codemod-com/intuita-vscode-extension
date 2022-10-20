import type { Diagnostic } from 'vscode';
import type { UriHash } from '../uris/types';
import {
	buildHash,
	buildIntuitaRange,
	buildIntuitaSimpleRange,
	calculateLengths,
	calculateLines,
	getSeparator,
} from '../utilities';
import type { DiagnosticHash, DiagnosticHashIngredients } from './types';

const stringifyCode = (code: Diagnostic['code']): string => {
	if (code === undefined) {
		return '';
	}

	if (typeof code === 'string') {
		return code;
	}

	if (typeof code === 'number') {
		return String(code);
	}

	return [String(code.value), code.target.toString()].join(',');
};

export const buildDiagnosticHashIngredients = (
	uriHash: UriHash,
	diagnostic: Diagnostic,
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
