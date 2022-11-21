import type {
	Node,
	CallExpression,
	JsxAttribute,
	JsxSelfClosingElement,
} from 'typescript';
import type { RepairCodeByTscCaseSubKind } from '../cases/types';
import type { ReplacementEnvelope } from '../components/inferenceService';
import type { EnhancedDiagnostic } from '../components/messageBus';
import type { extractKindsFromTs2345ErrorMessage } from './extractKindsFromTs2345ErrorMessage';
import type { File } from '../files/types';
import type { IntuitaSimpleRange } from '../utilities';

export type ClassifierDiagnostic = Readonly<{
	code: string;
	message: string;
	range: IntuitaSimpleRange;
}>;

export type Classification =
	| Readonly<{
			subKind: RepairCodeByTscCaseSubKind.OTHER;
			node: Node;
	  }>
	| Readonly<{
			subKind: RepairCodeByTscCaseSubKind.TS2769_OBJECT_ASSIGN;
			node: CallExpression;
	  }>
	| Readonly<{
			subKind: RepairCodeByTscCaseSubKind.TS2322_NEXT_JS_IMAGE_LAYOUT;
			node: JsxAttribute;
	  }>
	| Readonly<{
			subKind: RepairCodeByTscCaseSubKind.TS2741_NEXT_JS_IMAGE_ALT;
			node: JsxSelfClosingElement;
	  }>
	| Readonly<{
			subKind: RepairCodeByTscCaseSubKind.TS2345_PRIMITIVES;
			node: Node;
			kinds: NonNullable<
				ReturnType<typeof extractKindsFromTs2345ErrorMessage>
			>;
	  }>;

export type JobIngredients = Readonly<{
	classification: Classification;
	enhancedDiagnostic: EnhancedDiagnostic;
	file: File;
	replacementEnvelope: ReplacementEnvelope;
}>;
