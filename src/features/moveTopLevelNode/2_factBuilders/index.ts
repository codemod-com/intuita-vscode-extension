import {MoveTopLevelNodeUserCommand, RangeCriterion, RangeCriterionKind} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import {calculateSolution, Solution} from "./solutions";
import {getStringNodes, StringNode} from "./stringNodes";
import {buildTopLevelNodes} from "./buildTopLevelNodes";
import {calculateCharacterIndex, calculateLengths, calculateLines, isNeitherNullNorUndefined} from "../../../utilities";

export type MoveTopLevelNodeFact = Readonly<{
    separator: string,
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    lengths: ReadonlyArray<number>,
    stringNodes: ReadonlyArray<StringNode>,
    solutions: ReadonlyArray<Solution>,
}>;

export const calculateCharacterRanges = (
    rangeCriterion: RangeCriterion,
    separator: string,
    lengths: ReadonlyArray<number>,
) => {
    if (rangeCriterion.kind === RangeCriterionKind.DOCUMENT) {
        const start = 0;

        const end = calculateCharacterIndex(
            separator,
            lengths,
            lengths.length - 1,
            lengths[lengths.length - 1] ?? 0,
        );

        const range = [
            start,
            end,
        ] as const;

        return [ range ];
    }

    const { ranges } = rangeCriterion;

    return ranges.map(
        (range) => {
            const start = calculateCharacterIndex(
                separator,
                lengths,
                range[0],
                range[1],
            );

            const end = calculateCharacterIndex(
                separator,
                lengths,
                range[2],
                range[3],
            );

            return [
                start,
                end,
            ] as const;
        }
    );
};

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
): MoveTopLevelNodeFact => {
    const {
        fileName,
        fileText,
        options,
        rangeCriterion,
    } = userCommand;

    const separator = fileText.includes('\r\n')
        ? '\r\n'
        : '\n';

    const lines = calculateLines(fileText, separator);
    const lengths = calculateLengths(lines);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const characterRanges = calculateCharacterRanges( // reconsider this function
        rangeCriterion,
        separator,
        lengths,
    );

    const updatedTopLevelNodes = topLevelNodes
        .map(
            (topLevelNode, oldIndex) => {
                const updated = characterRanges
                    .some(
                        (characterRange) => {
                            return topLevelNode.triviaStart <= characterRange[0]
                                && characterRange[1] <= topLevelNode.triviaEnd;
                        }
                    ) || rangeCriterion.kind === RangeCriterionKind.DOCUMENT; // TODO hacky

                return {
                    updated,
                    oldIndex,
                };
            }
        )
        .filter(
            ({ updated }) => updated,
        );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutions = updatedTopLevelNodes
        .map(
            ({ oldIndex }) => {
                return calculateSolution(
                    topLevelNodes,
                    oldIndex,
                    options.topLevelNodeKindOrder,
                );
            },
        )
        .filter(isNeitherNullNorUndefined)
        .sort((a, b) => {
            return Math.sign(a.score - b.score);
        });

    return {
        separator,
        topLevelNodes,
        lengths,
        stringNodes,
        solutions,
    };
};