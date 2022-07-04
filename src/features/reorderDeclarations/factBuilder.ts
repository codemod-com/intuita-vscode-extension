import * as ts from "typescript";
import {isNeitherNullNorUndefined} from "../../utilities";
import {ReorderDeclarationsUserCommand} from "./userCommandBuilder";

export type NoraNode =
    | Readonly<{
        children: ReadonlyArray<NoraNode>;
    }>
    | Readonly<{
        node: ts.Node,
}   >;

export type ReorderDeclarationFact = Readonly<{
    noraNode: NoraNode,
    indices: ReadonlyArray<number>,
}>;

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
            return {
                node,
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
}