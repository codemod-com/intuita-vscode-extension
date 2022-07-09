import {buildMoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./2_factBuilders/2_factBuilder";
import {SourceFileExecution} from "../../utilities";
import { buildMoveTopLevelNodeAstCommand } from "./3_astCommandBuilder";
import { executeMoveTopLevelNodeAstCommand } from "./4_astCommandExecutor";

export const moveTopLevelNode = (
    fileName: string,
    fileText: string,
    fileLine: number,
): ReadonlyArray<SourceFileExecution> => {
    const userCommand = buildMoveTopLevelNodeUserCommand(
        fileName,
        fileText,
        fileLine,
    );

    const fact = buildMoveTopLevelNodeFact(
        userCommand,
    );

    console.log(fact)

    const astCommand = buildMoveTopLevelNodeAstCommand(
        userCommand,
        fact,
    );

    if (astCommand === null) {
        return [];
    }

    return executeMoveTopLevelNodeAstCommand(
        astCommand,
    );
};