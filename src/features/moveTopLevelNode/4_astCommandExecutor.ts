import {calculateLines, moveElementInArray} from "../../utilities";
import { StringNode } from "./2_factBuilders/stringNodes";

export const executeMoveTopLevelNodeAstCommandHelper = (
    oldIndex: number,
    newIndex: number,
    characterDifference: number,
    stringNodes: ReadonlyArray<StringNode>,
    separator: string,
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

    const lines = calculateLines(initialText, separator);

    const nodeLines = (newNodes[index]?.text ?? '')
        .slice(0, characterDifference)
        .split(separator);

    const line = lines.length + nodeLines.length - 2;
    const character = nodeLines[nodeLines.length-1]?.length ?? 0;

    return {
        text,
        line,
        character,
    };
};
