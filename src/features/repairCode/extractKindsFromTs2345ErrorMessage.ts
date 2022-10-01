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

	const [
		received,
		expected,
	] = kinds;

	if (!received || !expected) {
		return null;
	}

	return {
		received,
		expected,
	};
};
