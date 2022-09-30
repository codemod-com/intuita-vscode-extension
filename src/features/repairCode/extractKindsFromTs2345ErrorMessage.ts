export const extractKindsFromTs2345ErrorMessage = (message: string) => {
	const kinds = message
		.replace("Argument of type '", '')
		.replace("' is not assignable to parameter of type '", '|')
		.replace("'.", '')
		.split('|')
		.slice(0, 2)
		.filter(
			(kind): kind is 'boolean' | 'number' | 'string' =>
				kind === 'boolean' || kind === 'number' || kind === 'string',
		);

	if (kinds.length !== 2) {
		return null;
	}

	return {
		expected: kinds[1]!,
		received: kinds[0]!,
	};
};
