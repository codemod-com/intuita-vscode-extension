import * as ts from 'typescript';
import { CaseKind } from '../cases/types';
import { extractKindsFromTs2345ErrorMessage } from '../features/repairCode/extractKindsFromTs2345ErrorMessage';
import { IntuitaSimpleRange } from '../utilities';
import { Classification, ClassifierDiagnostic } from './types';

const isRangeWithinNode = (node: ts.Node, range: IntuitaSimpleRange) =>
	node.getStart() <= range.start && node.getEnd() >= range.end;

const getTs2769ObjectAssignReplacementNode = (
	node: ts.Node,
): ts.CallExpression | null => {
	if (!ts.isCallExpression(node.parent)) {
		return null;
	}

	const callExpression = node.parent;

	if (
		callExpression.arguments.length < 2 ||
		!ts.isPropertyAccessExpression(callExpression.expression)
	) {
		return null;
	}

	const pae = callExpression.expression;

	if (
		pae.expression.getText() !== 'Object' ||
		pae.name.getText() !== 'assign'
	) {
		return null;
	}

	return callExpression;
};

const getTs2322NextJSImageComponentExcessiveAttribute = (
	node: ts.Node,
): ts.JsxAttribute | null => {
	if (!ts.isIdentifier(node) || node.text !== 'layout') {
		return null;
	}

	const parent = node.parent;

	if (!ts.isJsxAttribute(parent)) {
		return null;
	}

	const grandParent = node.parent.parent;

	if (!ts.isJsxAttributes(grandParent)) {
		return null;
	}

	const greatGrandParent = grandParent.parent;

	if (!ts.isJsxSelfClosingElement(greatGrandParent)) {
		return null;
	}

	const { tagName } = greatGrandParent;

	if (!ts.isIdentifier(tagName)) {
		return null;
	}

	if (tagName.text !== 'Image') {
		return null;
	}

	return parent;
};

const getTs2741NextJSImageComponentMissingAttribute = (
	node: ts.Node,
): ts.JsxSelfClosingElement | null => {
	const { parent } = node;

	if (!ts.isJsxSelfClosingElement(parent)) {
		return null;
	}

	const { tagName } = parent;

	if (!ts.isIdentifier(tagName)) {
		return null;
	}

	if (tagName.text !== 'Image') {
		return null;
	}

	return parent;
};

const getNode = (node: ts.Node, range: IntuitaSimpleRange): ts.Node | null => {
	if (!isRangeWithinNode(node, range)) {
		return null;
	}

	const children = node.getChildren();

	for (const child of children) {
		const result = getNode(child, range);

		if (result !== null) {
			return result;
		}
	}

	return node;
};

export const classify = (
	sourceFile: ts.SourceFile,
	diagnostic: ClassifierDiagnostic,
): Classification => {
	const errorNode = getNode(sourceFile, diagnostic.range);

	if (!errorNode) {
		throw new Error('Could not find the error node for the diagnostic range');
	}

	switch(diagnostic.code) {
		case '2769': {
			const node = getTs2769ObjectAssignReplacementNode(errorNode);

			if (node) {
				return {
					kind: CaseKind.TS2769_OBJECT_ASSIGN,
					node,
				};
			}

			break;
		}
		case '2322': {
			const node = getTs2322NextJSImageComponentExcessiveAttribute(errorNode);

			if (node) {
				return {
					kind: CaseKind.TS2322_NEXTJS_IMAGE_COMPONENT_EXCESSIVE_ATTRIBUTE,
					node,
				};
			}

			break;
		}
		case '2741': {
			const node = getTs2741NextJSImageComponentMissingAttribute(errorNode);

			if (node) {
				return {
					kind: CaseKind.TS2741_NEXTJS_IMAGE_COMPONENT_MISSING_ATTRIBUTE,
					node,
				};
			}

			break;
		}
		case '2345': {
			const kinds = extractKindsFromTs2345ErrorMessage(diagnostic.message);

			if (kinds) {
				return {
					kind: CaseKind.TS2345_PRIMITIVES,
					kinds,
					node: errorNode,
				}
			}
		}
	}

	return {
		kind: CaseKind.OTHER,
		node: errorNode,
	};
};
