import { calculateAverage } from "../../../utilities";
import { TopLevelNodeKind } from "./topLevelNode";

type Node = Readonly<{
    kind: TopLevelNodeKind,
}>;

export const calculateNodesScore = (
    nodes: ReadonlyArray<Node>,
    kindOrder: ReadonlyArray<TopLevelNodeKind>,
): number => {
    if (kindOrder.length === 0) {
        return 0;
    }

    const nodeScores = nodes.map(
        (rightNode, rightIndex) => {
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
    );

    return calculateAverage(nodeScores);
};