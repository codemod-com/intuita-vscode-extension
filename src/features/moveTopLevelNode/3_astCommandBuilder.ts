import { MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact } from "./2_factBuilders";
import { Solution } from "./2_factBuilders/solutions";
import { StringNode } from "./2_factBuilders/stringNodes";

export type Options = Readonly<{
    solutionIndex: number,
}>;

export type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    oldIndex: number,
    stringNodes: ReadonlyArray<StringNode>,
    solution: Solution,
}>;

export const buildMoveTopLevelNodeAstCommand = (
    {
        fileName,
    }: MoveTopLevelNodeUserCommand,
    {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
        solutions,
    }: MoveTopLevelNodeFact,
    {
        solutionIndex,
    }: Options,
): MoveTopLevelNodeAstCommand | null => {
    if (topLevelNodes.length === 0 || selectedTopLevelNodeIndex === -1) {
        return null;
    }

    const solution = solutions[solutionIndex] ?? null;

    if (solution === null) {
        return null;
    }

    return {
        kind: "MOVE_TOP_LEVEL_NODE",
        fileName,
        oldIndex: selectedTopLevelNodeIndex,
        solution,
        stringNodes,
    };
};