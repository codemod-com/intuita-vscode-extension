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
            tokens.push(currentToken);

            currentToken = '';
        }

        if (character !== ' ' && character !== '_') {
            currentToken += character;
        }
    }

    if (currentToken.length !== 0) {
        tokens.push(currentToken);
    }

    return tokens
        .flatMap(
            (token) => {
                if (token.length === 0) {
                    return token;
                }

                const lowerCaseToken = token.toLocaleLowerCase();

                if (token[0] === lowerCaseToken[0]) {
                    return lowerCaseToken;
                }

                for(let i = 1; i < token.length; i++) {
                    if (token[i] === lowerCaseToken[i]) {
                        return [
                            lowerCaseToken.slice(0, i-1),
                            lowerCaseToken.slice(i-1),
                        ];
                    }
                }

                return lowerCaseToken;
            }
        )
        .filter((token) => token !== '');
};

