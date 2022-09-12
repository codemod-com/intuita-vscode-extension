import { calculateLines } from "../../utilities";
import {RepairCodeFact} from "./factBuilder";

export const executeRepairCodeCommand = (
    fact: RepairCodeFact,
) => {
    const previousCharacters = fact.fileText
        .slice(0, fact.range.start);

    const afterCharacters = fact.fileText
        .slice(fact.range.end);

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
