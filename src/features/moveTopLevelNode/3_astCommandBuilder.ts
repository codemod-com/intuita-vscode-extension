import { moveElementInArray } from "../../utilities";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact} from "./2_factBuilder";

export const buildMoveTopLevelNodeAstCommand = (
    userCommand: MoveTopLevelNodeUserCommand,
    {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
    }: MoveTopLevelNodeFact,
) => {
    if (topLevelNodes.length === 0 || selectedTopLevelNodeIndex === -1) {
        return null;
    }

    const nodesArray = (new Array(topLevelNodes.length))
        // .map((_, index) => index)
        .map((_, index) => {
            return moveElementInArray(
                topLevelNodes,
                selectedTopLevelNodeIndex,
                index,
            );
        });


}