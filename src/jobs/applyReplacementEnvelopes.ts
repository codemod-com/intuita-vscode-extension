import { ReplacementEnvelope } from '../components/inferenceService';

export const applyReplacementEnvelopes = (
	text: string,
	replacementEnvelopes: ReadonlyArray<ReplacementEnvelope>,
): string => {
	let newText: string = text;
	let shift = 0;

	for (const { range, replacement } of replacementEnvelopes) {
		newText =
			newText.slice(0, range.start + shift) +
			replacement +
			newText.slice(range.end + shift);

		shift += replacement.length - (range.end - range.start);
	}

	return newText;
};
