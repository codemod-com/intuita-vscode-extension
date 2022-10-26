import * as ts from 'typescript';
import { CaseKind } from '../cases/types';
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
	const node = getNode(sourceFile, diagnostic.range);

	if (!node) {
		throw new Error('Could not find the node for the diagnostic range');
	}

	if (diagnostic.code === '2769') {
		const callExpression = getTs2769ObjectAssignReplacementNode(node);

		if (callExpression) {
			return {
				kind: CaseKind.TS2769_OBJECT_ASSIGN,
				node: callExpression,
			};
		}
	}

	return {
		kind: CaseKind.OTHER,
		node,
	};
};
