import { calculateAverage } from "../../../utilities";
import { TopLevelNodeKind, TopLevelNodeModifier } from "./topLevelNode";

type Node = Readonly<{
    modifier: TopLevelNodeModifier,
    kind: TopLevelNodeKind,
}>;

export const calculateKindScore = (
    nodes: ReadonlyArray<Node>,
    rightIndex: number,
    kindOrder: ReadonlyArray<TopLevelNodeKind>,
) => {
    const rightNode = nodes[rightIndex];

    if (!rightNode) {
        return 0;
    }

    const rightKindIndex = kindOrder.indexOf(rightNode.kind);

    const leftNodes = nodes.slice(0, rightIndex);

    const leftNodeScores = leftNodes.map(
        (leftNode) => {
            const leftKindIndex = kindOrder.indexOf(leftNode.kind);

            return Math.max(
                (leftKindIndex - rightKindIndex) / kindOrder.length,
                0,
            );
        },
    );

    return calculateAverage(leftNodeScores);
}

export const calculateNodesScore = (
    nodes: ReadonlyArray<Node>,
    modifierOrder: ReadonlyArray<TopLevelNodeModifier>,
    kindOrder: ReadonlyArray<TopLevelNodeKind>,
): number => {
    if (modifierOrder.length === 0 || kindOrder.length === 0) {
        return 0;
    }

    const nodeScores = nodes.map(
        (_, rightIndex) => {
            return calculateKindScore(
                nodes,
                rightIndex,
                kindOrder,
            );
        }
    );

    return calculateAverage(nodeScores);
};