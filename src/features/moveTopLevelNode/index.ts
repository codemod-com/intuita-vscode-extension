import {buildMoveTopLevelNodeUserCommand} from "./userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./factBuilder";

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