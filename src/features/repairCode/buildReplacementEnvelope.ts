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
import { buildTs2741NextJsImageNoAltReplacementEnvelope } from './buildTs2741NextJsImageNoAltReplacementEnvelope';
import { extractKindsFromTs2345ErrorMessage } from './extractKindsFromTs2345ErrorMessage';

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
		return buildTs2741NextJsImageNoAltReplacementEnvelope(
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
