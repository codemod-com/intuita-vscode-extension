type ReplacementArguments = Readonly<{
	text: string,
	receivedKind: 'boolean' | 'number' | 'string',
	expectedKind: 'boolean' | 'number' | 'string',
}>;

export const buildReplacement = (
	replacementArguments: ReplacementArguments,
): string => {
	if (replacementArguments.expectedKind === 'boolean') {
		return `Boolean(${replacementArguments.text})`;
	}

	if (replacementArguments.expectedKind === 'number') {
		return `Number(${replacementArguments.text})`;
	}

	if (replacementArguments.expectedKind === 'string') {
		return `String(${replacementArguments.text})`;
	}

	return replacementArguments.text;
};
