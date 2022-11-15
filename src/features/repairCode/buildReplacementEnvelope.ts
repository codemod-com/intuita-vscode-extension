import { RepairCodeByTscCaseSubKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import type { File } from '../../files/types';
import { buildIntuitaRange, buildIntuitaSimpleRange } from '../../utilities';
import type { VscodeDiagnostic } from '../../vscode/types';
import { buildTs2322NextJsImageLayoutReplacementEnvelope } from './buildTs2322NextJsImageLayoutReplacementEnvelope';
import { buildTs2345PrimitivesReplacementEnvelope } from './buildTs2345PrimitivesReplacementEnvelope';
import { buildTs2741NextJsImageAltReplacementEnvelope } from './buildTs2741NextJsImageAltReplacementEnvelope';
import { buildTs2769ObjectAssignReplacementEnvelope } from './buildTs2769ObjectAssignReplacementEnvelope';

export const buildReplacementEnvelope = (
	file: File,
	diagnostic: VscodeDiagnostic,
	classification: Classification,
): ReplacementEnvelope => {
	if (
		classification.subKind ===
		RepairCodeByTscCaseSubKind.TS2769_OBJECT_ASSIGN
	) {
		return buildTs2769ObjectAssignReplacementEnvelope(classification);
	}

	if (
		classification.subKind ===
		RepairCodeByTscCaseSubKind.TS2322_NEXTJS_IMAGE_LAYOUT
	) {
		return buildTs2322NextJsImageLayoutReplacementEnvelope(classification);
	}

	if (
		classification.subKind ===
		RepairCodeByTscCaseSubKind.TS2741_NEXTJS_IMAGE_ALT
	) {
		return buildTs2741NextJsImageAltReplacementEnvelope(classification);
	}

	if (
		classification.subKind === RepairCodeByTscCaseSubKind.TS2345_PRIMITIVES
	) {
		return buildTs2345PrimitivesReplacementEnvelope(
			file,
			diagnostic,
			classification,
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

	return {
		range: intuitaSimpleRange,
		replacement: rangeText,
	};
};
