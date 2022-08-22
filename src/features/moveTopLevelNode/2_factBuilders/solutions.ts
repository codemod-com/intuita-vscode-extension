import { isNeitherNullNorUndefined, moveElementInArray } from "../../../utilities";
import { calculateNodesScore } from "./calculateNodesScore";
import { TopLevelNode, TopLevelNodeKind } from "./topLevelNode";

export type Solution = Readonly<{
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    newIndex: number,
    score: number,
}>;

const kindOrder: ReadonlyArray<TopLevelNodeKind> = [
    TopLevelNodeKind.ENUM,
    TopLevelNodeKind.TYPE_ALIAS,
    TopLevelNodeKind.INTERFACE,
    TopLevelNodeKind.FUNCTION,
    TopLevelNodeKind.CLASS,
    TopLevelNodeKind.BLOCK,
    TopLevelNodeKind.VARIABLE,
    TopLevelNodeKind.UNKNOWN,
];

export const calculateSolution = (
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
): Solution | null => {
    const oldScore = calculateNodesScore(
        nodes,
        kindOrder,
    );

    return nodes
        .map((_, newIndex) => {
            if (oldIndex === newIndex) {
                return null;
            }

            const newNodes = moveElementInArray(
                nodes,
                oldIndex,
                newIndex,
            );

            const newScore = calculateNodesScore(
                newNodes,
                kindOrder,
            );

            return [
                newNodes,
                newIndex,
                newScore,
            ] as const;
        })
        .filter(isNeitherNullNorUndefined)
        .filter(([_, __, newScore]) => {
            return newScore < oldScore;
        })
        .map(([ newNodes, newIndex, score ]) => {
            

            return {
                nodes: newNodes,
                oldIndex,
                newIndex,
                score,
            };
        })
        .sort((a, b) => {
            return Math.sign(a.score - b.score);
        })
        [0] ?? null;
};