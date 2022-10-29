import type { Node, CallExpression, JsxAttribute } from 'typescript';
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
	  }>
	| Readonly<{
			kind: CaseKind.TS2322_NEXTJS_IMAGE_COMPONENT_EXCESSIVE_ATTRIBUTE;
			node: JsxAttribute;
	  }>;

export type JobIngredients = Readonly<{
	classification: Classification;
	enhancedDiagnostic: EnhancedDiagnostic;
	file: File;
	inferenceJob: InferenceJob;
}>;
