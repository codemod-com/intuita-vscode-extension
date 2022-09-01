import {IntuitaRange} from "../../utilities";
import { TopLevelNodeKind, TopLevelNodeModifier } from "./2_factBuilders/topLevelNode";

export type MoveTopLevelNodeOptions = Readonly<{
    modifierOrder: ReadonlyArray<TopLevelNodeModifier>,
    kindOrder: ReadonlyArray<TopLevelNodeKind>,
    minimumLines: number,
}>;

export type MoveTopLevelNodeUserCommand = Readonly<{
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName: string,
    fileText: string,
    options: MoveTopLevelNodeOptions,
}>;
