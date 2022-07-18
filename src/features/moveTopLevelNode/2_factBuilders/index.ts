import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import { calculateSolutions, Solution } from "./solutions";
import { getStringNodes, StringNode } from "./stringNodes";
import { buildTopLevelNodes } from "./buildTopLevelNodes";
import { calculateLengths, calculateLines} from "../../../utilities";

export type MoveTopLevelNodeFact = Readonly<{
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
    } = userCommand;

    const separator = '\n';

    const lines = calculateLines(fileText, separator);
    const lengths = calculateLengths(lines);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutions = topLevelNodes.map(
        (_, index) => {
            return calculateSolutions(
                topLevelNodes,
                index,
                options,
            );
        }
    );

    return {
        topLevelNodes,
        lengths,
        stringNodes,
        solutions,
    };
};