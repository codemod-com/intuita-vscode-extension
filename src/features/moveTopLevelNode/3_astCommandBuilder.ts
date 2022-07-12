import { MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact } from "./2_factBuilders";
import { StringNode } from "./2_factBuilders/stringNodes";

export type Options = Readonly<{
    solutionIndex: number,
}>;

export type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    fileText: string,
    oldIndex: number,
    newIndex: number,
    selectedIndex: number,
}>;

export const buildMoveTopLevelNodeAstCommand = (
    {
        fileName,
        fileText,
    }: MoveTopLevelNodeUserCommand,
    {
        topLevelNodes,
        stringNodes,
        solutions,
        selectedIndex,
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
        fileText,
        oldIndex: solution.oldIndex,
        newIndex: solution.newIndex,
        selectedIndex,
    };
};