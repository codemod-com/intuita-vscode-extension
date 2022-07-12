import {MoveTopLevelNodeAstCommand} from "./3_astCommandBuilder";
import {moveElementInArray, SourceFileExecution} from "../../utilities";

export const executeMoveTopLevelNodeAstCommand = (
    {
        fileName,
        oldIndex,
        newIndex,
        selectedIndex,
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

    const index = stringNodes
        .map(
            ({ topLevelNodeIndex }, index) => {
                return {
                    topLevelNodeIndex,
                    index,
                };
            }
        )
        .find(
            ({ topLevelNodeIndex }) => topLevelNodeIndex === newIndex
        )
        ?.index ?? 0;
    
    const lineNumber = stringNodes
        .slice(0, index - 1)
        .map(({ topLevelNodeIndex, text}) => {
            if (topLevelNodeIndex === null) {
                return text;
            }

            return movedTopLevelNodeTexts[topLevelNodeIndex] ?? '';
        })
        .join('')
        .split('\n')
        .length + (index === 1 ? 1 : 0);

    console.log(index, lineNumber)

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
            lineNumber,
        }
    ];
};