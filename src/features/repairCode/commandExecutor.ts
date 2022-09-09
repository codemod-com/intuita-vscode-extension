import { RepairCodeUserCommand } from "./userCommand";
import {RepairCodeFact} from "./factBuilder";

export const executeRepairCodeCommand = (
    userCommand: RepairCodeUserCommand,
    fact: RepairCodeFact,
) => {
    const previousCharacters = userCommand.fileText
        .slice(0, fact.range.start);

    const afterCharacters = userCommand.fileText
        .slice(fact.range.end);

    const fileText = previousCharacters.concat(
        userCommand.replacement,
        afterCharacters,
    );

    return {
        fileText,
    };
};
