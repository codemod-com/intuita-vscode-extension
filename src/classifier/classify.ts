import * as ts from 'typescript';
import { IntuitaSimpleRange } from '../utilities';
import {
	CaseKind,
	Classification,
	ClassifierDiagnostic,
} from './types';

const isRangeWithinNode = (node: ts.Node, range: IntuitaSimpleRange) =>
	node.getFullStart() <= range.start && node.getEnd() >= range.end;

const getTs2769ObjectAssignReplacementRange = (
	node: ts.Node,
): IntuitaSimpleRange | null => {
	if (!ts.isCallExpression(node.parent)) {
		return null;
	}

	const callExpression = node.parent;

	if (callExpression.arguments.length < 2) {
		return null;
	}

	if (!ts.isPropertyAccessExpression(callExpression.expression)) {
		return null;
	}

	const pae = callExpression.expression;

	const expressionText = pae.expression.getText();
	const nameText = pae.name.getText();

	if (expressionText !== 'Object' || nameText !== 'assign') {
		return null;
	}

	return {
		start: callExpression.getFullStart(),
		end: callExpression.getEnd(),
	};
};

const getNode = (node: ts.Node, range: IntuitaSimpleRange): ts.Node | null => {
	if (!isRangeWithinNode(node, range)) {
		return null;
	}

	const children = node.getChildren();

	if (children.length === 0) {
		return node;
	}

	for (const child of children) {
		const result = getNode(child, range);

		if (result !== null) {
			return result;
		}
	}

	return null;
};

export const classify = (
	sourceFile: ts.SourceFile,
	diagnostic: ClassifierDiagnostic,
): Classification => {
	const otherClassification: Classification = {
		kind: CaseKind.OTHER,
		replacementRange: diagnostic.range,
	};

	if (diagnostic.code !== '2769') {
		return otherClassification;
	}

	const node = getNode(sourceFile, diagnostic.range);

	if (node === null) {
		return otherClassification;
	}

	const replacementRange = getTs2769ObjectAssignReplacementRange(node);

	if (replacementRange) {
		return {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange,
		};
	}

	return otherClassification;
};
