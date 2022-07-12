import {MoveTopLevelNodeAstCommand} from "./3_astCommandBuilder";
import {calculateLines, moveElementInArray, SourceFileExecution} from "../../utilities";
import {getStringNodes} from "./2_factBuilders/stringNodes";
import {buildTopLevelNodes} from "./2_factBuilders/buildTopLevelNodes";

export const executeMoveTopLevelNodeAstCommand = (
    {
        fileName,
        fileText,
        oldIndex,
        newIndex,
        characterDifference
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

    const newNodes = stringNodes
        .map(
            ({ topLevelNodeIndex, text}) => {
                if (topLevelNodeIndex === null) {
                    return {
                        topLevelNodeIndex,
                        text,
                        match: false,
                    };
                }

                return {
                    topLevelNodeIndex,
                    text: movedTopLevelNodeTexts[topLevelNodeIndex] ?? '',
                    match: topLevelNodeIndex === newIndex,
                }
            });

    const text = newNodes
        .map(({ text }) => text)
        .join('');

    const index = newNodes.findIndex(({ match }) => match);

    const initialText = newNodes
        .slice(0, index)
        .map(({ text }) => text)
        .join('');

    const lines = calculateLines(initialText, '\n');

    // initial
    let line = lines.length - 1;
    let character = characterDifference;

    console.log(index, line, character)

    return [
        {
            name: fileName,
            text,
            line,
            character,
        }
    ];
};