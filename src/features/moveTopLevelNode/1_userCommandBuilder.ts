import {IntuitaRange} from "../../utilities";

export type MoveTopLevelNodeOptions = Readonly<{}>;

export const enum RangeCriterionKind {
    RANGES = 1,
    DOCUMENT = 2,
}

export type RangeCriterion =
    | Readonly<{
        kind: RangeCriterionKind.RANGES,
        ranges: ReadonlyArray<IntuitaRange>,
    }>
    | Readonly<{
        kind: RangeCriterionKind.DOCUMENT,
    }>;

export type MoveTopLevelNodeUserCommand = Readonly<{
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName: string,
    fileText: string,
    options: MoveTopLevelNodeOptions,
    rangeCriterion: RangeCriterion,
}>;
