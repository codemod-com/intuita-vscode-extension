import {calculateLines, moveElementInArray} from "../../utilities";
import { MoveTopLevelNodeJob } from "./job";

export const executeMoveTopLevelNodeJob = (
    job: MoveTopLevelNodeJob,
    characterDifference: number,
) => {
    const topLevelNodeTexts = job.stringNodes
        .filter((stringNode) => stringNode.topLevelNodeIndex !== null)
        .map(({ text }) => text);

    const movedTopLevelNodeTexts = moveElementInArray(
        topLevelNodeTexts,
        job.oldIndex,
        job.newIndex,
    );

    const newNodes = job.stringNodes
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
                    match: topLevelNodeIndex === job.newIndex,
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

    const lines = calculateLines(initialText, job.separator);

    const nodeLines = (newNodes[index]?.text ?? '')
        .slice(0, characterDifference)
        .split(job.separator);

    const line = lines.length + nodeLines.length - 2;
    const character = nodeLines[nodeLines.length-1]?.length ?? 0;

    return {
        text,
        line,
        character,
    };
};
