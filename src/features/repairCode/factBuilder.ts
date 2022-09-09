import {RepairCodeUserCommand} from "./userCommand";
import {
    buildIntuitaSimpleRange,
    calculateLengths,
    calculateLines,
    getSeparator,
    IntuitaSimpleRange
} from "../../utilities";
import {FactKind} from "../../facts";

export type RepairCodeFact = Readonly<{
    kind: FactKind.repairCode,
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
        kind: FactKind.repairCode,
        range,
    };
};
