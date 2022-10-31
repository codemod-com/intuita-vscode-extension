import {
	createSourceFile,
	isCallExpression,
	isExpressionStatement,
	ScriptKind,
	ScriptTarget,
} from 'typescript';
import { CaseKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { buildTs2769ObjectAssignReplacement } from './buildReplacement';

export const buildTs2769ObjectAssignReplacementEnvelope = (
	classification: Classification & { kind: CaseKind.TS2769_OBJECT_ASSIGN },
): ReplacementEnvelope => {
	const start = classification.node.getStart();
	const end = classification.node.getEnd();

	const text = classification.node.getText();

	const sourceFile = createSourceFile(
		'index.ts',
		text,
		ScriptTarget.Latest,
		false,
		ScriptKind.TS,
	);

	const statement = sourceFile.statements[0];

	if (!statement || !isExpressionStatement(statement)) {
		throw Error('The statement should be an expression statement');
	}

	const { expression } = statement;

	if (!isCallExpression(expression)) {
		throw Error('The expression should be a call expression');
	}

	const replacement = buildTs2769ObjectAssignReplacement(
		expression.arguments,
	);

	return {
		range: { start, end },
		replacement,
	};
};
