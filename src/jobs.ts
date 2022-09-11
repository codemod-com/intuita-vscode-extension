import {IntuitaPosition, IntuitaRange} from "./utilities";
import {JobHash} from "./features/moveTopLevelNode/jobHash";

export const enum JobKind {
    moveTopLevelNode = 1,
    repairCode = 2,
}

export type IntuitaJob =
    | Readonly<{
        kind: JobKind.moveTopLevelNode,
        fileName: string,
        hash: JobHash,
        title: string,
        range: IntuitaRange,
        oldIndex: number,
        newIndex: number,
        score: [number, number],
    }>
    | Readonly<{
        kind: JobKind.repairCode,
        fileName: string,
        hash: JobHash,
        title: string,
        range: IntuitaRange,
        replacement: string,
    }>;

export type JobOutput = Readonly<{
    text: string,
    range: IntuitaRange,
    position: IntuitaPosition,
}>;
