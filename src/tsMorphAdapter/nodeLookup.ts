import {Node, SourceFile, ts} from "ts-morph";

export type NodeLookupCriterion = Readonly<{
    sourceFile: SourceFile, // in the future this can be replaced with a filePath
    topBottomPath: ReadonlyArray<ts.SyntaxKind>;
    text: string;
}>;

export const buildNodeLookupCriterion = (
    sourceFile: SourceFile,
    node: ts.Node,
): NodeLookupCriterion => {
    const bottomTopPath: ts.SyntaxKind[] = [];
    const text = node.getText();

    while(node) {
        bottomTopPath.push(node.kind);

        node = node.parent;
    }

    const topBottomPath = bottomTopPath.reverse();

    return {
        sourceFile,
        topBottomPath,
        text,
    };
};

export const lookupNode = (
    { sourceFile, topBottomPath, text }: NodeLookupCriterion,
): ReadonlyArray<Node> => {
    const lookup = (
        node: Node,
        path: ReadonlyArray<ts.SyntaxKind>
    ): ReadonlyArray<Node> => {
        const syntaxKind = path[0];

        if (!syntaxKind || node.getKind() !== syntaxKind) {
            return [];
        }

        if (path.length === 1) {
            return [ node ];
        }

        const nodes: Node[] = [];

        node.forEachChild(
            (childNode) => {
                nodes.push(
                    ...lookup(childNode, path.slice(1))
                );
            }
        );

        return nodes;
    };

    const nodes = lookup(
        sourceFile,
        topBottomPath,
    );

    return nodes
        .filter(
            node => node.getText() === text
        );
};