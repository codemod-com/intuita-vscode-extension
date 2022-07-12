import {MoveTopLevelNodeAstCommand} from "./3_astCommandBuilder";
import {moveElementInArray, SourceFileExecution} from "../../utilities";
import {getStringNodes} from "./2_factBuilders/stringNodes";
import {buildTopLevelNodes} from "./2_factBuilders/buildTopLevelNodes";

export const executeMoveTopLevelNodeAstCommand = (
    {
        fileName,
        fileText,
        oldIndex,
        newIndex,
        selectedIndex,
    }: MoveTopLevelNodeAstCommand
): ReadonlyArray<SourceFileExecution> => {
    if (oldIndex === newIndex) {
        return [];
    }

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

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

    // console.log(index, lineNumber)

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