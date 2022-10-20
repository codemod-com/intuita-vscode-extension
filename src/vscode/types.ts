import type { Uri } from 'vscode';

export interface VscodePosition {
	line: number;
	character: number;
}

export interface VscodeRange {
	start: VscodePosition;
	end: VscodePosition;
}

export interface VscodeDiagnostic {
	code?:
		| string
		| number
		| {
				value: string | number;
				target: Pick<Uri, 'toString'>;
		  };
	message: string;
	range: VscodeRange;
}
