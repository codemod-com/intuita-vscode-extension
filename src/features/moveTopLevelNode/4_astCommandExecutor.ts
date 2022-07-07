import {MoveTopLevelNodeAstCommand} from "./3_astCommandBuilder";
import {SourceFileExecution} from "../../utilities";

export const executeMoveTopLevelNodeAstCommand = (
    {
        fileName,
        oldIndex,
        newIndex,
        stringNodes,
    }: MoveTopLevelNodeAstCommand
): ReadonlyArray<SourceFileExecution> => {
    if (oldIndex === newIndex) {
        return [];
    }



    return [
        {
            name: fileName,
            text: '',
        }
    ];
};