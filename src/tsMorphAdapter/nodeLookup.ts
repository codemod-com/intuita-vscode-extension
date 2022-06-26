import {Node, Project, ts} from "ts-morph";

export const enum NodeFlags {
    STATEMENTED_NODE = 1,
}

export type NodeLookupCriterion = Readonly<{
    fileName: string,
    topBottomPath: ReadonlyArray<ts.SyntaxKind>;
    topBottomFlags: ReadonlyArray<NodeFlags>;
    predicate: (node: Node, index: number, length: number) => boolean,
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
    node: ts.Node,
    predicate: (node: Node, index: number, length: number) => boolean,
): NodeLookupCriterion => {
    const bottomTopPath: ts.SyntaxKind[] = [];
    const bottomTopFlags: number[] = [];

    const { fileName } = node.getSourceFile();

    for(let i = 0; node !== undefined; ++i) {
        bottomTopPath.push(node.kind);

        const statemented = isStatementedSyntaxKind(node.kind)

        bottomTopFlags.push(
            Number(statemented && NodeFlags.STATEMENTED_NODE)
        );

        node = node.parent;
    }

    const topBottomPath = bottomTopPath.reverse();
    const topBottomFlags = bottomTopFlags.reverse();

    return {
        fileName,
        topBottomPath,
        topBottomFlags,
        predicate,
    };
};

export const lookupNode = (
    project: Project,
    { fileName, topBottomPath, topBottomFlags, predicate }: NodeLookupCriterion,
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

        if (!predicate(node, index, topBottomPath.length)) {
            return [];
        }

        if (
            !syntaxKind
            || node.getKind() !== syntaxKind
        )
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

        const children = node.getChildSyntaxList()?.getChildren() ?? [];

        if (children.length > 0) {
            children.forEach(
                (childNode) => {
                    nodes.push(
                        ...lookup(childNode, index + 1)
                    );
                }
            );
        } else {
            node.forEachChild(
                (childNode) => {
                    nodes.push(
                        ...lookup(childNode, index + 1)
                    );
                }
            );
        }

        return nodes;
    };

    const sourceFile = project.getSourceFile(fileName);

    if (!sourceFile) {
        return [];
    }

    return lookup(
        sourceFile,
        0,
    );
};