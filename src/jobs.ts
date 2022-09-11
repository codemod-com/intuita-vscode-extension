import {IntuitaPosition, IntuitaRange} from "./utilities";

export const enum JobKind {
    moveTopLevelNode = 1,
    repairCode = 2,
}

export type JobOutput = Readonly<{
    text: string,
    range: IntuitaRange,
    position: IntuitaPosition,
}>;
