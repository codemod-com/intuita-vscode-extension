import {RepairCodeUserCommand} from "./userCommand";
import {
    buildIntuitaSimpleRange,
    calculateLengths,
    calculateLines,
    IntuitaSimpleRange
} from "../../utilities";
import {FactKind} from "../../facts";

export type RepairCodeFact = Readonly<{
    kind: FactKind.repairCode,
    fileText: string,
    range: IntuitaSimpleRange,
    replacement: string,
    separator: string,
}>;

export const buildRepairCodeFact = (
    userCommand: RepairCodeUserCommand,
): RepairCodeFact => {
    const lines = calculateLines(userCommand.fileText, userCommand.separator);
    const lengths = calculateLengths(lines);

    const range = buildIntuitaSimpleRange(
        userCommand.separator,
        lengths,
        userCommand.range,
    );

    return {
        kind: FactKind.repairCode,
        fileText: userCommand.fileText,
        range,
        replacement: userCommand.replacement,
        separator: userCommand.separator,
    };
};
