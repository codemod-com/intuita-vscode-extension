import { isNeitherNullNorUndefined, moveElementInArray } from "../../../utilities";
import { calculateNodesScore } from "./calculateNodesScore";
import { TopLevelNode, TopLevelNodeKind } from "./topLevelNode";

export type Solution = Readonly<{
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    newIndex: number
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

export const calculateSolutions = (
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
): ReadonlyArray<Solution> => {
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

            return [newNodes, newIndex] as const;
        })
        .filter(isNeitherNullNorUndefined)
        .map(([ newNodes, newIndex ]) => {
            const score = calculateNodesScore(
                newNodes,
                kindOrder,
            );

            return {
                nodes: newNodes,
                oldIndex,
                newIndex,
                score,
            };
        })
        .sort((a, b) => {
            return Math.sign(a.score - b.score);
        });
        
};