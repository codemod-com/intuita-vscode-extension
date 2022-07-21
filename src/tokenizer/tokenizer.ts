export const tokenize = (
    text: string,
): ReadonlyArray<string> => {
    const tokens: string[] = [];

    let currentToken = '';

    for (let i = 0; i < text.length; ++i) {
        const character = text[i];

        if (character === undefined) {
            continue;
        }

        const lastCurrentTokenCharacter = currentToken[currentToken.length - 1] ?? null;

        if (lastCurrentTokenCharacter === null) {
            currentToken += character;
            continue;
        }

        const isLowerCase = lastCurrentTokenCharacter.toLocaleLowerCase()
            === lastCurrentTokenCharacter;

        const isUpperCase = character.toLocaleUpperCase() === character;

        const caseChanged = isLowerCase && isUpperCase;

        if (caseChanged || character === ' ' || character === '_') {
            tokens.push(currentToken.toLocaleLowerCase());

            currentToken = '';
        }

        if (character !== ' ' && character !== '_') {
            currentToken += character;
        }
    }

    if (currentToken.length !== 0) {
        tokens.push(currentToken.toLocaleLowerCase());
    }

    return tokens;
};

