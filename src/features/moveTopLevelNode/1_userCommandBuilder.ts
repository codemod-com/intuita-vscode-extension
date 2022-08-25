import {IntuitaRange} from "../../utilities";
import { TopLevelNodeKind } from "./2_factBuilders/topLevelNode";

export type MoveTopLevelNodeOptions = Readonly<{
    topLevelNodeKindOrder: ReadonlyArray<TopLevelNodeKind>,
    minimumLines: number,
}>;

export type MoveTopLevelNodeUserCommand = Readonly<{
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName: string,
    fileText: string,
    options: MoveTopLevelNodeOptions,
}>;
