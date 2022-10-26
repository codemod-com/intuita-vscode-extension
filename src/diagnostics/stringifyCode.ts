import type { VscodeDiagnostic } from '../vscode/types';

export const stringifyCode = (code: VscodeDiagnostic['code']): string => {
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
