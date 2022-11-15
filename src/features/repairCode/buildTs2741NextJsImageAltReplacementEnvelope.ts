import {
	createPrinter,
	createSourceFile,
	EmitHint,
	factory,
	NewLineKind,
	ScriptKind,
	ScriptTarget,
} from 'typescript';
import { RepairCodeByTscCaseSubKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';

export const buildTs2741NextJsImageAltReplacementEnvelope = (
	classification: Classification & {
		subKind: RepairCodeByTscCaseSubKind.TS2741_NEXTJS_IMAGE_ALT;
	},
): ReplacementEnvelope => {
	const sourceFile = createSourceFile(
		'index.ts',
		'',
		ScriptTarget.Latest,
		false,
		ScriptKind.TSX,
	);

	const printer = createPrinter({ newLine: NewLineKind.LineFeed });

	const jsxAttribute = factory.createJsxAttribute(
		factory.createIdentifier('alt'),
		factory.createStringLiteral('', true),
	);

	const { properties } = classification.node.attributes;

	const lastAttribute = properties[properties.length - 1];

	if (!lastAttribute) {
		const jsxSelfClosingElement = factory.updateJsxSelfClosingElement(
			classification.node,
			classification.node.tagName,
			classification.node.typeArguments,
			factory.createJsxAttributes([jsxAttribute]),
		);

		const replacement = printer.printNode(
			EmitHint.Expression,
			jsxSelfClosingElement,
			sourceFile,
		);

		const start = classification.node.getStart();
		const end = classification.node.getEnd();

		return {
			range: { start, end },
			replacement,
		};
	}

	const start = lastAttribute.getEnd();
	const end = start;

	const width = lastAttribute.getLeadingTriviaWidth();
	const triviaText = lastAttribute.getFullText().slice(0, width);

	const replacement = printer.printNode(
		EmitHint.Unspecified,
		jsxAttribute,
		sourceFile,
	);

	return {
		range: { start, end },
		replacement: `${triviaText}${replacement}`,
	};
};
