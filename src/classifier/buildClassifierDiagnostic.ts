import { stringifyCode } from '../diagnostics/stringifyCode';
import { buildIntuitaRange, buildIntuitaSimpleRange } from '../utilities';
import type { VscodeDiagnostic } from '../vscode/types';
import type { ClassifierDiagnostic } from './types';

export const buildClassifierDiagnostic = (
	separator: string,
	lengths: ReadonlyArray<number>,
	diagnostic: VscodeDiagnostic,
): ClassifierDiagnostic => {
	const code = stringifyCode(diagnostic.code);

	const intuitaRange = buildIntuitaRange(diagnostic.range);

	const range = buildIntuitaSimpleRange(separator, lengths, intuitaRange);

	return {
		code,
		message: diagnostic.message,
		range,
	};
};
