import {
    MoveTopLevelNodeOptions,
    MoveTopLevelNodeUserCommand
} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./2_factBuilders";
import {SourceFileExecution} from "../../utilities";
import { buildMoveTopLevelNodeAstCommand } from "./3_astCommandBuilder";
import { executeMoveTopLevelNodeAstCommand } from "./4_astCommandExecutor";

export const moveTopLevelNode = (
    fileName: string,
    fileText: string,
    topLevelNodeIndex: number,
    options: MoveTopLevelNodeOptions,
): ReadonlyArray<SourceFileExecution> => {
    const userCommand: MoveTopLevelNodeUserCommand = {
        kind: 'MOVE_TOP_LEVEL_NODE',
        fileName,
        fileText,
        options,
    };

    const fact = buildMoveTopLevelNodeFact(
        userCommand,
    );

    const astCommand = buildMoveTopLevelNodeAstCommand(
        userCommand,
        fact,
        {
            topLevelNodeIndex,
            solutionIndex: 0,
        }
    );

    if (astCommand === null) {
        return [];
    }

    return executeMoveTopLevelNodeAstCommand(
        astCommand,
    );
};