import { IntuitaSimpleRange } from '../utilities';

export interface ClassifierDiagnostic {
	readonly code: string;
	readonly message: string;
	readonly range: IntuitaSimpleRange;
}

export const enum CaseKind {
	OTHER = 1,
	TS2769_OBJECT_ASSIGN = 2,
}

export interface Classification {
	kind: CaseKind;
	replacementRange: IntuitaSimpleRange;
}
