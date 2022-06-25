import {ts} from "ts-morph";

export type NodeLookupCriterion = Readonly<{
    bottomTopPath: ReadonlyArray<ts.SyntaxKind>;
    text: string;
}>;

export const buildNodeLookupCriterion = (
    node: ts.Node,
): NodeLookupCriterion => {
    const bottomTopPath: ts.SyntaxKind[] = [];
    const text = node.getText();

    while(node) {
        bottomTopPath.push(node.kind);

        node = node.parent;
    }

    return {
        bottomTopPath,
        text,
    };
};