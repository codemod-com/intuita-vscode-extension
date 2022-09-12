import { IntuitaRange } from "../../utilities";

export type RepairCodeUserCommand = Readonly<{
    kind: 'REPAIR_CODE',
    fileName: string,
    fileText: string,
    range: IntuitaRange,
    replacement: string,
}>;
