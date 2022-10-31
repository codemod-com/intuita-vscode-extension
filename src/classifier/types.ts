import type {
	Node,
	CallExpression,
	JsxAttribute,
	JsxSelfClosingElement,
} from 'typescript';
import type { CaseKind } from '../cases/types';
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
			kind: CaseKind.OTHER;
			node: Node;
	  }>
	| Readonly<{
			kind: CaseKind.TS2769_OBJECT_ASSIGN;
			node: CallExpression;
	  }>
	| Readonly<{
			kind: CaseKind.TS2322_NEXTJS_IMAGE_LAYOUT;
			node: JsxAttribute;
	  }>
	| Readonly<{
			kind: CaseKind.TS2741_NEXTJS_IMAGE_ALT;
			node: JsxSelfClosingElement;
	  }>
	| Readonly<{
			kind: CaseKind.TS2345_PRIMITIVES;
			node: Node;
			kinds: NonNullable<
				ReturnType<typeof extractKindsFromTs2345ErrorMessage>
			>;
	  }>;

export type JobIngredients = Readonly<{
	classification: Classification;
	enhancedDiagnostic: EnhancedDiagnostic;
	file: File;
	inferenceJob: ReplacementEnvelope;
}>;
