import { MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact } from "./2_factBuilders";

export type Options = Readonly<{
    topLevelNodeIndex: number,
    solutionIndex: number,
}>;

export type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    fileText: string,
    oldIndex: number,
    newIndex: number,
    characterDifference: number, // TODO?
}>;

export const buildMoveTopLevelNodeAstCommand = (
    {
        fileName,
        fileText,
    }: MoveTopLevelNodeUserCommand,
    {
        topLevelNodes,
        solutions,
        // characterDifference,
    }: MoveTopLevelNodeFact,
    {
        topLevelNodeIndex,
        solutionIndex,
    }: Options,
): MoveTopLevelNodeAstCommand | null => {
    if (topLevelNodes.length === 0) {
        return null;
    }

    const solution = solutions[topLevelNodeIndex]?.[solutionIndex] ?? null;

    if (solution === null || solution.oldIndex === solution.newIndex) {
        return null;
    }

    return {
        kind: "MOVE_TOP_LEVEL_NODE",
        fileName,
        fileText,
        oldIndex: solution.oldIndex,
        newIndex: solution.newIndex,
        characterDifference: 0, // TODO
    };
};