import {RepairCodeUserCommand} from "./userCommand";
import {
    buildIntuitaSimpleRange,
    calculateLengths,
    calculateLines,
    getSeparator,
    IntuitaSimpleRange
} from "../../utilities";

export type RepairCodeFact = Readonly<{
    range: IntuitaSimpleRange,
}>;

export const buildRepairCodeFact = (
    userCommand: RepairCodeUserCommand,
): RepairCodeFact => {
    const separator = getSeparator(userCommand.fileText);
    const lines = calculateLines(userCommand.fileText, separator);
    const lengths = calculateLengths(lines);

    const range = buildIntuitaSimpleRange(
        separator,
        lengths,
        userCommand.range,
    );

    return {
        range,
    };
};
