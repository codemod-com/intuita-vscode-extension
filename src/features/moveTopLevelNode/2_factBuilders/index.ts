import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
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

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
): MoveTopLevelNodeFact | null => {
    const {
        fileName,
        fileText,
        options,
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

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutionHashes = new Set<SolutionHash>();

    const solutions = topLevelNodes
        .map(
            (_, oldIndex) => {
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