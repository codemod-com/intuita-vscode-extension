import type { Node, CallExpression } from 'typescript';
import type { CaseKind } from '../cases/types';
import type { InferenceJob } from '../components/inferenceService';
import type { EnhancedDiagnostic } from '../components/messageBus';
import type { File } from '../files/types';
import type { IntuitaSimpleRange } from '../utilities';

export type ClassifierDiagnostic = Readonly<{
	code: string;
	message: string;
	range: IntuitaSimpleRange;
}>;

export type Classification =
	| Readonly<{
			kind: CaseKind.OTHER;
			node: Node;
	  }>
	| Readonly<{
			kind: CaseKind.TS2769_OBJECT_ASSIGN;
			node: CallExpression;
	  }>;

export type JobIngredients = Readonly<{
	classification: Classification;
	enhancedDiagnostic: EnhancedDiagnostic;
	file: File;
	inferenceJob: InferenceJob;
}>;
