import {buildMoveTopLevelNodeUserCommand, MoveTopLevelNodeOptions} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./2_factBuilders";
import {SourceFileExecution} from "../../utilities";
import { buildMoveTopLevelNodeAstCommand } from "./3_astCommandBuilder";
import { executeMoveTopLevelNodeAstCommand } from "./4_astCommandExecutor";

export const moveTopLevelNode = (
    fileName: string,
    fileText: string,
    fileLine: number,
    options: MoveTopLevelNodeOptions,
): ReadonlyArray<SourceFileExecution> => {
    (fileLine);

    const userCommand = buildMoveTopLevelNodeUserCommand(
        fileName,
        fileText,
        // fileLine,
        // 0,
        // false,
        options,
    );

    const fact = buildMoveTopLevelNodeFact(
        userCommand,
    );

    const astCommand = buildMoveTopLevelNodeAstCommand(
        userCommand,
        fact,
        {
            topLevelNodeIndex: 0, // TODO
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