import { IntuitaSimpleRange } from '../utilities';

export interface ClassifierDiagnostic {
	readonly code: string;
	readonly message: string;
	readonly range: IntuitaSimpleRange;
}

export const enum CaseKind {
	OTHER = 1,
	TS2369_OBJECT_ASSIGN = 2,
}

export interface Replacement {
	readonly range: IntuitaSimpleRange;
	readonly text: string;
}

export interface Classification {
	kind: CaseKind;
	replacement: Replacement;
}
