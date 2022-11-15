import { RepairCodeByTscCaseSubKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import type { File } from '../../files/types';
import { buildIntuitaRange, buildIntuitaSimpleRange } from '../../utilities';
import type { VscodeDiagnostic } from '../../vscode/types';
import { buildReplacement } from './buildReplacement';

export const buildTs2345PrimitivesReplacementEnvelope = (
	file: File,
	diagnostic: VscodeDiagnostic,
	classification: Classification & {
		subKind: RepairCodeByTscCaseSubKind.TS2345_PRIMITIVES;
	},
): ReplacementEnvelope => {
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

	const replacement = buildReplacement({
		text: rangeText,
		receivedKind: classification.kinds.received,
		expectedKind: classification.kinds.expected,
	});

	return {
		range: intuitaSimpleRange,
		replacement,
	};
};
