import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import { calculateSolutions, Solution } from "./solutions";
import { getStringNodes, StringNode } from "./stringNodes";
import { buildTopLevelNodes } from "./buildTopLevelNodes";
import { calculateLengths, calculateLines} from "../../../utilities";

export type MoveTopLevelNodeFact = Readonly<{
    separator: string,
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    lengths: ReadonlyArray<number>,
    stringNodes: ReadonlyArray<StringNode>,
    solutions: ReadonlyArray<ReadonlyArray<Solution>>,
}>;

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
): MoveTopLevelNodeFact => {
    const {
        fileName,
        fileText,
        options,
        characterRanges,
    } = userCommand;

    const separator = '\n'; // TODO we should check if this is the correct one!

    const lines = calculateLines(fileText, separator);
    const lengths = calculateLengths(lines);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const updatedTopLevelNodes = topLevelNodes
        .map(
            (topLevelNode, oldIndex) => {
                const updated = characterRanges
                    .some(
                        (characterRange) => {
                            return characterRange[0] <= topLevelNode.triviaEnd
                                && characterRange[1] >= topLevelNode.triviaStart;
                        }
                    );

                return [
                    topLevelNode,
                    updated,
                    oldIndex,
                ] as const;
            }
        )
        .filter(
            ([updated]) => updated,
        );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutions = updatedTopLevelNodes.map(
        ([_, __, oldIndex]) => {
            return calculateSolutions(
                topLevelNodes,
                oldIndex,
                options,
            );
        },
    );

    return {
        separator,
        topLevelNodes,
        lengths,
        stringNodes,
        solutions,
    };
};