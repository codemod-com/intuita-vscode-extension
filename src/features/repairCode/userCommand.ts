import { IntuitaRange } from "../../utilities";

export type RepairCodeUserCommand = Readonly<{
    kind: 'REPAIR_CODE',
    fileName: string,
    fileText: string, // TODO perhaps this could be removed
    range: IntuitaRange,
    replacement: string,
    separator: string,
    lines: ReadonlyArray<string>,
    lengths: ReadonlyArray<number>,
}>;
