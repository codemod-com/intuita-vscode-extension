import { isNeitherNullNorUndefined, moveElementInArray } from "../../../utilities";
import { buildSolutionHash, SolutionHash } from "../solutionHash";
import { calculateNodesScore } from "./calculateNodesScore";
import { TopLevelNode, TopLevelNodeKind, TopLevelNodeModifier } from "./topLevelNode";

export type Solution = Readonly<{
    hash: SolutionHash,
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    newIndex: number,
    score: [number, number]
}>;

export const calculateSolution = (
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    modifierOrder: ReadonlyArray<TopLevelNodeModifier>,
    kindOrder: ReadonlyArray<TopLevelNodeKind>
): Solution | null => {
    const oldScore = calculateNodesScore(
        nodes,
        modifierOrder,
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
                modifierOrder,
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
            return newScore[0] < oldScore[0] && newScore[1] < oldScore[1];
        })
        .map(([ newNodes, newIndex, score ]) => {
            const hash = buildSolutionHash(
                newNodes.map(({ id }) => id),
            );

            return {
                hash,
                nodes: newNodes,
                oldIndex,
                newIndex,
                score,
            };
        })
        .sort((a, b) => {
            const modifierSign = Math.sign(a.score[0] - b.score[0]);

            if (modifierSign !== 0) {
                return modifierSign;
            }

            return Math.sign(a.score[1] - b.score[1]);
        })
        [0] ?? null;
};