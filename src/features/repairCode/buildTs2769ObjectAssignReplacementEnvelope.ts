import { CaseKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import type { File } from '../../files/types';
import { buildIntuitaRangeFromSimpleRange } from '../../utilities';
import { buildTs2769ObjectAssignReplacement } from './buildReplacement';

export const buildTs2769ObjectAssignReplacementEnvelope = (
	file: File,
	classification: Classification & { kind: CaseKind.TS2769_OBJECT_ASSIGN },
): ReplacementEnvelope => {
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
};
