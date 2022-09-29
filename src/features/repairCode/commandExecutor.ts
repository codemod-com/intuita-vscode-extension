import { calculateLines } from "../../utilities";
import { RepairCodeJob } from "./job";

export const executeRepairCodeCommand = (
    fact: RepairCodeJob,
) => {
    const previousCharacters = fact.fileText
        .slice(0, fact.simpleRange.start);

    const afterCharacters = fact.fileText
        .slice(fact.simpleRange.end);

    const text = previousCharacters.concat(
        fact.replacement,
        afterCharacters,
    );

    const lines = calculateLines(previousCharacters, fact.separator);

    const line = lines.length;
    const character = lines[lines.length - 1]?.length ?? 0;

    return {
        text,
        line,
        character,
    };
};
