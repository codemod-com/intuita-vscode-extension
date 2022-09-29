import {
    IntuitaSimpleRange
} from "../../utilities";
import {FactKind} from "../../facts";

export type RepairCodeFact = Readonly<{
    kind: FactKind.repairCode,
    separator: string,
    // TODO remove fileText if possible
    fileText: string,
    range: IntuitaSimpleRange,
    replacement: string,
}>;
