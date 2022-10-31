import { CaseKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { stringifyCode } from '../../diagnostics/stringifyCode';
import type { File } from '../../files/types';
import {
	buildIntuitaRange,
	buildIntuitaSimpleRange,
} from '../../utilities';
import type { VscodeDiagnostic } from '../../vscode/types';
import {
	buildReplacement,
} from './buildReplacement';
import { buildTs2322NextJsImageLayoutReplacementEnvelope } from './buildTs2322NextJsImageLayoutReplacementEnvelope';
import { buildTs2741NextJsImageAltReplacementEnvelope } from './buildTs2741NextJsImageAltReplacementEnvelope';
import { buildTs2769ObjectAssignReplacementEnvelope } from './buildTs2769ObjectAssignReplacementEnvelope';
import { extractKindsFromTs2345ErrorMessage } from './extractKindsFromTs2345ErrorMessage';

export const buildReplacementEnvelope = (
	file: File,
	diagnostic: VscodeDiagnostic,
	classification: Classification,
): ReplacementEnvelope => {
	if (classification.kind === CaseKind.TS2769_OBJECT_ASSIGN) {
		return buildTs2769ObjectAssignReplacementEnvelope(
			file,
			classification.node,
		)
	}

	if (
		classification.kind ===
		CaseKind.TS2322_NEXTJS_IMAGE_COMPONENT_EXCESSIVE_ATTRIBUTE
	) {
		return buildTs2322NextJsImageLayoutReplacementEnvelope(
			file,
			classification.node,
		);
	}

	if (classification.kind === CaseKind.TS2741_NEXTJS_IMAGE_COMPONENT_MISSING_ATTRIBUTE) {
		return buildTs2741NextJsImageAltReplacementEnvelope(
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
