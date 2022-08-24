import {MoveTopLevelNodeUserCommand, RangeCriterion, RangeCriterionKind} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import {calculateSolution, Solution} from "./solutions";
import {getStringNodes, StringNode} from "./stringNodes";
import {buildTopLevelNodes} from "./buildTopLevelNodes";
import {calculateCharacterIndex, calculateLengths, calculateLines, isNeitherNullNorUndefined} from "../../../utilities";
import { SolutionHash } from "../solutionHash";

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
): MoveTopLevelNodeFact | null => {
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

    if (lines.length < options.minimumLines) {
        return null;
    }

    const lengths = calculateLengths(lines);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    if (topLevelNodes.length < options.minimumTopLevelBlocks) {
        return null;
    }

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

    const solutionHashes = new Set<SolutionHash>();

    const solutions = updatedTopLevelNodes
        .map(
            ({ oldIndex }) => {
                const solution = calculateSolution(
                    topLevelNodes,
                    oldIndex,
                    options.topLevelNodeKindOrder,
                );

                if (!solution || solutionHashes.has(solution.hash)) {
                    return null;
                }

                solutionHashes.add(solution.hash);

                return solution;
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