import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import { calculateSolutions, Solution } from "./solutions";
import { getStringNodes, StringNode } from "./stringNodes";
import { buildTopLevelNodes } from "./buildTopLevelNodes";

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedTopLevelNodeIndex: number,
    stringNodes: ReadonlyArray<StringNode>,
    solutions: ReadonlyArray<Solution>,
}>;

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
): MoveTopLevelNodeFact => {
    const {
        fileName,
        fileText,
        fileLine,
        options,
    } = userCommand;

    const fineLineStart = fileText
        .split('\n')
        .filter((_, index) => index < fileLine)
        .map(({ length }) => length)
        .reduce((a, b) => a + b + 1, 0); // +1 for '\n'

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const selectedTopLevelNodeIndex = topLevelNodes
        .findIndex(node => node.start <= fineLineStart && fineLineStart <= node.end );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutions = calculateSolutions(
        topLevelNodes,
        selectedTopLevelNodeIndex,
        options,
    );

    return {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
        solutions,
    };
};