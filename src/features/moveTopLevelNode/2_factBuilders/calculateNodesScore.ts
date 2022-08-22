import { TopLevelNode, TopLevelNodeKind } from "./topLevelNode";

type Node = Readonly<{
    kind: TopLevelNodeKind,
}>;

export const calculateNodesScore = (
    nodes: ReadonlyArray<Node>,
    kindOrder: ReadonlyArray<TopLevelNodeKind>,
): number => {
    nodes;
    kindOrder;
    
    return 1;
};