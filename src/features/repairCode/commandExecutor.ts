import {RepairCodeFact} from "./factBuilder";

export const executeRepairCodeCommand = (
    fact: RepairCodeFact,
) => {
    const previousCharacters = fact.fileText
        .slice(0, fact.range.start);

    const afterCharacters = fact.fileText
        .slice(fact.range.end);

    const fileText = previousCharacters.concat(
        fact.replacement,
        afterCharacters,
    );

    return {
        fileText,
    };
};
