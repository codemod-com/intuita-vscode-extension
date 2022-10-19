import * as ts from 'typescript';
import { IntuitaSimpleRange } from '../utilities';
import {
	CaseKind,
	Classification,
	ClassifierDiagnostic,
	Replacement,
} from './types';

const isRangeWithinNode = (node: ts.Node, range: IntuitaSimpleRange) =>
	node.getFullStart() <= range.start && node.getEnd() >= range.end;

const getTs2769ObjectAssignReplacement = (
	node: ts.Node,
): Replacement | null => {
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

	const range = {
		start: callExpression.getFullStart(),
		end: callExpression.getEnd(),
	};

	return {
		range,
		text: callExpression.getFullText(),
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
		replacement: {
			range: diagnostic.range,
			text: sourceFile
				.getFullText()
				.slice(diagnostic.range.start, diagnostic.range.end),
		},
	};

	if (diagnostic.code !== '2769') {
		return otherClassification;
	}

	const node = getNode(sourceFile, diagnostic.range);

	if (node === null) {
		return otherClassification;
	}

	const replacement = getTs2769ObjectAssignReplacement(node);

	if (replacement) {
		return {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacement,
		};
	}

	return otherClassification;
};
