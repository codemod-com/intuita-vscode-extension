import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import {calculateSolution, Solution} from "./solutions";
import {getStringNodes, StringNode} from "./stringNodes";
import {buildTopLevelNodes} from "./buildTopLevelNodes";
import {calculateLengths, calculateLines, getSeparator, isNeitherNullNorUndefined} from "../../../utilities";
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

    const separator = getSeparator(fileText);
    const lines = calculateLines(fileText, separator);

    if (lines.length < options.minimumLines) {
        return null;
    }

    const lengths = calculateLengths(lines);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutionHashes = new Set<SolutionHash>();

    const solutions = topLevelNodes
        .map(
            (_, oldIndex) => {
                const solution = calculateSolution(
                    topLevelNodes,
                    oldIndex,
                    options.modifierOrder,
                    options.kindOrder,
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