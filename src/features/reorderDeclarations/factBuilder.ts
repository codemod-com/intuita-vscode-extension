import * as ts from "typescript";
import {isNeitherNullNorUndefined} from "../../utilities";
import {ReorderDeclarationsUserCommand} from "./userCommandBuilder";

export type NoraNode =
    | Readonly<{
        children: ReadonlyArray<NoraNode>,
    }>
    | Readonly<{
        node: ts.Node,
        identifiers: ReadonlySet<string>,
        childIdentifiers: ReadonlySet<string>,
}   >;

export type ReorderDeclarationFact = Readonly<{
    noraNode: NoraNode,
    indices: ReadonlyArray<number>,
}>;

export const getChildIdentifiers = (
    node: ts.Node
): ReadonlyArray<string> => {
    if (ts.isIdentifier(node)) {
        return [ node.text ];
    }

    return node
        .getChildren()
        .map(
            childNode => getChildIdentifiers(childNode)
        )
        .flat();
};

export const getIdentifiers = (
    node: ts.Node,
): ReadonlyArray<string> => {
    if(
        ts.isClassDeclaration(node)
        || ts.isFunctionDeclaration(node)
    ) {
        const text = node.name?.text ?? null;

        if (text === null) {
            return [];
        }

        return [ text ];
    }

    if (
        ts.isInterfaceDeclaration(node)
        || ts.isInterfaceDeclaration(node)
        || ts.isTypeAliasDeclaration(node)
    ) {
        return [ node.name.text ];
    }

    if (ts.isVariableStatement(node)) {
         return node
            .declarationList
            .declarations
            .map(
                ({ name }) => name
            )
            .filter(ts.isIdentifier)
            .map(({ text }) => text);
    }

    return [];
};

export const buildReorderDeclarationFact = (
    userCommand: ReorderDeclarationsUserCommand,
): ReorderDeclarationFact => {
    const { fileName, fileText } = userCommand;

    const sourceFile = ts.createSourceFile(
        fileName,
        fileText,
        ts.ScriptTarget.ES5,
        true
    );

    const buildNoraNode = (node: ts.Node, depth: number): NoraNode => {
        if (depth === 1) {
            const identifiers = new Set(getIdentifiers(node));
            const childIdentifiers = new Set(getChildIdentifiers(node));

            identifiers.forEach((identifier) => {
                childIdentifiers.delete(identifier);
            });

            return {
                node,
                identifiers,
                childIdentifiers,
            };
        }

        const children = node
            .getChildren()
            .flatMap(childNode => {
                if (childNode.kind === ts.SyntaxKind.SyntaxList) {
                    return childNode
                        .getChildren()
                        .map(grandChildNode => {
                            return buildNoraNode(grandChildNode, depth + 1);
                        });
                }

                return buildNoraNode(childNode, depth + 1);
            });

        return {
            children,
        };
    };

    const noraNode = buildNoraNode(sourceFile, 0);

    const indices: ReadonlyArray<number> = 'children' in noraNode && noraNode.children.map(
        (childNode, index) => {
            if (!('node' in childNode)) {
                return null;
            }

            const { node } = childNode;

            if (
                ts.isClassDeclaration(node)
                || ts.isFunctionDeclaration(node)
                || ts.isInterfaceDeclaration(node)
                || ts.isBlock(node)
                || ts.isTypeAliasDeclaration(node)
                || ts.isVariableStatement(node)
            ) {
                return index;
            }

            return null;
        }
    ).filter(isNeitherNullNorUndefined) || [];

    return {
        noraNode,
        indices,
    };
};
