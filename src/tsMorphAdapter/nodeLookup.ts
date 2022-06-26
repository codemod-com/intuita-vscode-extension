import {Node, SourceFile, ts} from "ts-morph";

export const enum NodeFlags {
    STATEMENTED_NODE = 1,
}

export type NodeLookupCriterion = Readonly<{
    sourceFile: SourceFile, // in the future this can be replaced with a filePath
    topBottomPath: ReadonlyArray<ts.SyntaxKind>;
    topBottomFlags: ReadonlyArray<NodeFlags>;
    topBottomTexts: ReadonlyArray<string | null>;
}>;

// borrowed from ts-morph
const isStatementedSyntaxKind = (syntaxKind: ts.SyntaxKind): boolean => {
    switch (syntaxKind) {
        case ts.SyntaxKind.ArrowFunction:
        case ts.SyntaxKind.Block:
        case ts.SyntaxKind.CaseClause:
        case ts.SyntaxKind.ClassStaticBlockDeclaration:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.DefaultClause:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.ModuleBlock:
        case ts.SyntaxKind.ModuleDeclaration:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.SourceFile:
            return true;
        default:
            return false;
    }
};

export const buildNodeLookupCriterion = (
    sourceFile: SourceFile,
    node: ts.Node,
    numberOfBottomTopTexts: number,
): NodeLookupCriterion => {
    const bottomTopPath: ts.SyntaxKind[] = [];
    const bottomTopTexts: (string | null)[] = [];
    const bottomTopFlags: number[] = [];

    for(let i = 0; node !== undefined; ++i) {
        bottomTopPath.push(node.kind);

        if (i < numberOfBottomTopTexts ) {
            bottomTopTexts.push(node.getText());
        } else {
            bottomTopTexts.push(null);
        }

        const statemented = isStatementedSyntaxKind(node.kind)

        bottomTopFlags.push(
            Number(statemented && NodeFlags.STATEMENTED_NODE)
        );

        node = node.parent;
    }

    const topBottomPath = bottomTopPath.reverse();
    const topBottomTexts = bottomTopTexts.reverse();
    const topBottomFlags = bottomTopFlags.reverse();

    return {
        sourceFile,
        topBottomPath,
        topBottomTexts,
        topBottomFlags,
    };
};

export const lookupNode = (
    { sourceFile, topBottomPath, topBottomTexts, topBottomFlags }: NodeLookupCriterion,
    getBottomStatementedNode: boolean = false,
): ReadonlyArray<Node> => {
    const bottomStatementedNodeIndex = topBottomFlags
        .slice()
        .map((nodeFlags) => Boolean(nodeFlags & NodeFlags.STATEMENTED_NODE))
        .lastIndexOf(true);

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

        if (getBottomStatementedNode && index === bottomStatementedNodeIndex) {
            return [ node ];
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