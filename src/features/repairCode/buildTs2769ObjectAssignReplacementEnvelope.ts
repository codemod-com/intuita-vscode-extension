import { CaseKind } from '../../cases/types';
import type { Classification } from '../../classifier/types';
import type { ReplacementEnvelope } from '../../components/inferenceService';
import { buildTs2769ObjectAssignReplacement } from './buildReplacement';

export const buildTs2769ObjectAssignReplacementEnvelope = (
	classification: Classification & { kind: CaseKind.TS2769_OBJECT_ASSIGN },
): ReplacementEnvelope => {
	const start = classification.node.getStart();
	const end = classification.node.getEnd();

	const replacement = buildTs2769ObjectAssignReplacement(
		classification.node.arguments,
	);

	return {
		range: { start, end },
		replacement,
	};
};
