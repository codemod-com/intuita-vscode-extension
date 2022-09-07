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

export const compareScores = (
    a: [number, number],
    b: [number, number],
): number => {
    const modifierSign = Math.sign(a[0] - b[0]);

    if (modifierSign !== 0) {
        return modifierSign;
    }

    return Math.sign(a[1] - b[1]);
};

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
            return compareScores(oldScore, newScore) > 0;
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
            return compareScores(a.score, b.score);
        })
        [0] ?? null;
};