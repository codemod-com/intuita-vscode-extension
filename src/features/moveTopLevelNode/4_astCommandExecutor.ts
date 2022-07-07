import {MoveTopLevelNodeAstCommand} from "./3_astCommandBuilder";
import {moveElementInArray, SourceFileExecution} from "../../utilities";

export const executeMoveTopLevelNodeAstCommand = (
    {
        fileName,
        oldIndex,
        newIndex,
        topLevelNodes, // deprecate!!! (remove from the structure) TODO
        stringNodes,
    }: MoveTopLevelNodeAstCommand
): ReadonlyArray<SourceFileExecution> => {
    if (oldIndex === newIndex) {
        return [];
    }

    const topLevelNodeTexts = stringNodes
        .filter((stringNode) => stringNode.topLevelNodeIndex !== null)
        .map(({ text }) => text);

    const movedTopLevelNodeTexts = moveElementInArray(
        topLevelNodeTexts,
        oldIndex,
        newIndex,
    );

    const text = stringNodes
        .map(
            ({ topLevelNodeIndex, text}) => {
                if (topLevelNodeIndex === null) {
                    return text;
                }

                return movedTopLevelNodeTexts[topLevelNodeIndex] ?? '';
            },
        )
        .join('');

    return [
        {
            name: fileName,
            text,
        }
    ];
};