import {buildMoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./2_factBuilder";

export const moveTopLevelNode = (
    fileName: string,
    fileText: string,
    fileLine: number,
) => {
    const userCommand = buildMoveTopLevelNodeUserCommand(
        fileName,
        fileText,
        fileLine,
    );

    buildMoveTopLevelNodeFact(
        userCommand,
    );
};