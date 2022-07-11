import { MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact } from "./2_factBuilders";
import { StringNode } from "./2_factBuilders/stringNodes";

export type Options = Readonly<{
    solutionIndex: number,
}>;

export type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    oldIndex: number,
    newIndex: number,
    stringNodes: ReadonlyArray<StringNode>,
}>;

export const buildMoveTopLevelNodeAstCommand = (
    {
        fileName,
    }: MoveTopLevelNodeUserCommand,
    {
        topLevelNodes,
        stringNodes,
        solutions,
    }: MoveTopLevelNodeFact,
    {
        solutionIndex,
    }: Options,
): MoveTopLevelNodeAstCommand | null => {
    if (topLevelNodes.length === 0) {
        return null;
    }

    const solution = solutions[solutionIndex] ?? null;

    if (solution === null || solution.oldIndex === solution.newIndex) {
        return null;
    }

    return {
        kind: "MOVE_TOP_LEVEL_NODE",
        fileName,
        oldIndex: solution.oldIndex,
        newIndex: solution.newIndex,
        stringNodes,
    };
};