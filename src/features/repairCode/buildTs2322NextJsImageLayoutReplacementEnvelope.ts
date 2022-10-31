import { CaseKind } from '../../cases/types';
import { Classification } from '../../classifier/types';
import { ReplacementEnvelope } from '../../components/inferenceService';

export const buildTs2322NextJsImageLayoutReplacementEnvelope = (
	classification: Classification & {
		kind: CaseKind.TS2322_NEXTJS_IMAGE_LAYOUT;
	},
): ReplacementEnvelope => {
	const start = classification.node.getFullStart();
	const end = classification.node.getEnd();

	return {
		range: {
			start,
			end,
		},
		replacement: '',
	};
};
