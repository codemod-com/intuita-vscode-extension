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

    for(let i = 0; i < topLevelNodes.length; ++i) {
        if (selectedTopLevelNodeIndex === i) {

        }
    }
}