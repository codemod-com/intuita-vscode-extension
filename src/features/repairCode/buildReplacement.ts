export const buildReplacement = (
    text: string,
    expectedKind: 'boolean' | 'number' | 'string',
): string => {
    if (expectedKind === 'boolean') {
        return `Boolean(${text})`;
    }

    if (expectedKind === 'number') {
        return `Number(${text})`;
    }

    if (expectedKind === 'string') {
        return `String(${text})`;
    }

    return text;
};
