type ReplacementArguments = Readonly<{
	text: string,
	receivedKind: 'boolean' | 'number' | 'string',
	expectedKind: 'boolean' | 'number' | 'string',
}>;

const regexp = /^(-|\+)?[0-9]+(.[0-9]+)?$/;

export const buildReplacement = (
	{
		expectedKind,
		receivedKind,
		text,
	}: ReplacementArguments,
): string => {
	if (expectedKind === 'boolean') {
		return `Boolean(${text})`;
	}

	if (expectedKind === 'number') {
		if (receivedKind === 'string') {
			const surroundedBySingleQuote = text.startsWith('\'') && text.endsWith('\'');
			const surroundedByDoubleQuote = text.startsWith('"') && text.endsWith('"');

			if (surroundedBySingleQuote || surroundedByDoubleQuote) {
				const value = text.slice(1, text.length - 1);

				if (value.length === 0) {
					return '0';
				}

				if (regexp.test(value)) {
					return value;
				}
			}
		}

		return `Number(${text})`;
	}

	if (expectedKind === 'string') {
		if (regexp.test(text)) {
			return `'${text}'`;
		}

		return `String(${text})`;
	}

	return text;
};
