import {Node, SourceFile, ts} from "ts-morph";

export type NodeLookupCriterion = Readonly<{
    sourceFile: SourceFile, // in the future this can be replaced with a filePath
    topBottomPath: ReadonlyArray<ts.SyntaxKind>;
    topBottomTexts: ReadonlyArray<string | null>;
}>;

export const buildNodeLookupCriterion = (
    sourceFile: SourceFile,
    node: ts.Node,
    numberOfBottomTopTexts: number,
): NodeLookupCriterion => {
    const bottomTopPath: ts.SyntaxKind[] = [];
    const bottomTopTexts: (string | null)[] = [];

    for(let i = 0; node !== undefined; ++i) {
        bottomTopPath.push(node.kind);

        if (i < numberOfBottomTopTexts ) {
            bottomTopTexts.push(node.getText());
        } else {
            bottomTopTexts.push(null);
        }

        node = node.parent;
    }

    const topBottomPath = bottomTopPath.reverse();
    const topBottomTexts = bottomTopTexts.reverse();

    return {
        sourceFile,
        topBottomPath,
        topBottomTexts,
    };
};

export const lookupNode = (
    { sourceFile, topBottomPath, topBottomTexts }: NodeLookupCriterion,
): ReadonlyArray<Node> => {
    const lookup = (
        node: Node,
        index: number,
    ): ReadonlyArray<Node> => {
        const syntaxKind = topBottomPath[index];
        const text = topBottomTexts[index];

        if (
            !syntaxKind
            || node.getKind() !== syntaxKind
            || (text && text !== node.getText()))
         {
            return [];
        }

        if (index === topBottomPath.length - 1) {
            return [ node ];
        }

        const nodes: Node[] = [];

        node.forEachChild(
            (childNode) => {
                nodes.push(
                    ...lookup(childNode, index + 1)
                );
            }
        );

        return nodes;
    };

    return lookup(
        sourceFile,
        0,
    );
};