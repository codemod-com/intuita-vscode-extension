import { CaseKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { InferenceJob } from '../../components/inferenceService';
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

export const buildInferenceJob = (
	file: File,
	diagnostic: VscodeDiagnostic,
	classification: Classification,
): InferenceJob => {
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
		const { properties } = classification.node.attributes;

		if (properties.length === 0) {
			
		}

		// TODO handle the case without attributes
		const lastAttribute = properties[properties.length - 1];

		if (!lastAttribute) {
			throw new Error('No last attribute');
		}

		const width = lastAttribute.getLeadingTriviaWidth();
		const triviaText = lastAttribute.getFullText().slice(0, width);

		const start = lastAttribute.getEnd();
		const end = start;

		const range = buildIntuitaRangeFromSimpleRange(
			file.separator,
			file.lengths,
			{ start, end },
		);

		return {
			range,
			replacement: `${triviaText}alt=\'\'`,
		};
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
