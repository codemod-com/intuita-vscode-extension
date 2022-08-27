import {calculateLines, moveElementInArray, SourceFileExecution} from "../../utilities";
import { StringNode } from "./2_factBuilders/stringNodes";

export const executeMoveTopLevelNodeAstCommandHelper = (
    fileName: string,
    oldIndex: number,
    newIndex: number,
    characterDifference: number,
    stringNodes: ReadonlyArray<StringNode>,
) => {
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
                };
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

    const nodeLines = (newNodes[index]?.text ?? '')
        .slice(0, characterDifference)
        .split('\n');

    const line = lines.length + nodeLines.length - 2;
    const character = nodeLines[nodeLines.length-1]?.length ?? 0;

    return {
        name: fileName,
        text,
        line,
        character,
    };
};