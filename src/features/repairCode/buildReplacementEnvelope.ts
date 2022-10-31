import { createPrinter, createSourceFile, EmitHint, factory, JsxSelfClosingElement, NewLineKind, ScriptKind, ScriptTarget } from 'typescript';
import { CaseKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { stringifyCode } from '../../diagnostics/stringifyCode';
import type { File } from '../../files/types';
import {
	buildIntuitaRange,
	buildIntuitaRangeFromSimpleRange,
	buildIntuitaSimpleRange,
} from '../../utilities';
import type { VscodeDiagnostic } from '../../vscode/types';
import {
	buildReplacement,
	buildTs2769ObjectAssignReplacement,
} from './buildReplacement';
import { extractKindsFromTs2345ErrorMessage } from './extractKindsFromTs2345ErrorMessage';

export const buildTs2741NextJsImageComponentMissingAttributeInferenceJob = (
	file: File,
	node: JsxSelfClosingElement,
): ReplacementEnvelope => {
	const sourceFile = createSourceFile(
		'index.ts',
		'',
		ScriptTarget.Latest,
		false,
		ScriptKind.TS,
	);

	const printer = createPrinter({ newLine: NewLineKind.LineFeed });

	const jsxAttribute = factory.createJsxAttribute(
		factory.createIdentifier('alt'),
		factory.createStringLiteral('', true),
	);

	const { properties } = node.attributes;

	const lastAttribute = properties[properties.length - 1];

	if (!lastAttribute) {
		const jsxSelfClosingElement = factory.updateJsxSelfClosingElement(
			node,
			node.tagName,
			node.typeArguments,
			factory.createJsxAttributes(
				[
					jsxAttribute,
				]
			)
		)
	
		const replacement = printer.printNode(EmitHint.Expression, jsxSelfClosingElement, sourceFile);

		const start = node.getStart();
		const end = node.getEnd();

		const range = buildIntuitaRangeFromSimpleRange(
			file.separator,
			file.lengths,
			{ start, end },
		);

		return {
			range,
			replacement,
		};
	}

	const start = lastAttribute.getEnd();
	const end = start;

	const range = buildIntuitaRangeFromSimpleRange(
		file.separator,
		file.lengths,
		{ start, end },
	);

	const width = lastAttribute.getLeadingTriviaWidth();
	const triviaText = lastAttribute.getFullText().slice(0, width);

	const replacement = printer.printNode(EmitHint.Unspecified, jsxAttribute, sourceFile);

	return {
		range,
		replacement: `${triviaText}${replacement}`,
	};
}

export const buildReplacementEnvelope = (
	file: File,
	diagnostic: VscodeDiagnostic,
	classification: Classification,
): ReplacementEnvelope => {
	if (classification.kind === CaseKind.TS2769_OBJECT_ASSIGN) {
		const start = classification.node.getStart();
		const end = classification.node.getEnd();

		const range = buildIntuitaRangeFromSimpleRange(
			file.separator,
			file.lengths,
			{ start, end },
		);

		const replacement = buildTs2769ObjectAssignReplacement(
			classification.node.arguments,
		);

		return {
			range,
			replacement,
		};
	}

	if (
		classification.kind ===
		CaseKind.TS2322_NEXTJS_IMAGE_COMPONENT_EXCESSIVE_ATTRIBUTE
	) {
		const start = classification.node.getFullStart();
		const end = classification.node.getEnd();

		const range = buildIntuitaRangeFromSimpleRange(
			file.separator,
			file.lengths,
			{ start, end },
		);

		return {
			range,
			replacement: '',
		};
	}

	if (classification.kind === CaseKind.TS2741_NEXTJS_IMAGE_COMPONENT_MISSING_ATTRIBUTE) {
		return buildTs2741NextJsImageComponentMissingAttributeInferenceJob(
			file,
			classification.node,
		);
	}

	const intuitaRange = buildIntuitaRange(diagnostic.range);

	const intuitaSimpleRange = buildIntuitaSimpleRange(
		file.separator,
		file.lengths,
		intuitaRange,
	);

	const rangeText = file.text.slice(
		intuitaSimpleRange.start,
		intuitaSimpleRange.end,
	);

	if (stringifyCode(diagnostic.code) === '2345') {
		const kinds = extractKindsFromTs2345ErrorMessage(diagnostic.message);

		if (kinds) {
			const replacement = buildReplacement({
				text: rangeText,
				receivedKind: kinds.received,
				expectedKind: kinds.expected,
			});

			return {
				range: intuitaRange,
				replacement,
			};
		}
	}

	return {
		range: intuitaRange,
		replacement: rangeText,
	};
};
