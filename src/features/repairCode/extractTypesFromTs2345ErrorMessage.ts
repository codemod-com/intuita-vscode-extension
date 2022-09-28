export const extractTypesFromTs2345ErrorMessage = (
    message: string
) => {
    const types = message
        .replace('Argument of type \'', '')
        .replace('\' is not assignable to parameter of type \'', '|')
        .replace('\'.', '')
        .split('|');

    return {
        expected: types[1] ?? '',
        received: types[0] ?? '',
    };
};
