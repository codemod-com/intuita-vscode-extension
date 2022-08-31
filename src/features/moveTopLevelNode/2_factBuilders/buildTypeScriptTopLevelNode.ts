import { isBlock, isClassDeclaration, isEnumDeclaration, isExportDeclaration, isFunctionDeclaration, isImportDeclaration, isInterfaceDeclaration, isTypeAliasDeclaration, isVariableDeclaration, isVariableStatement, Node, SyntaxKind } from "typescript";
import { TopLevelNodeKind } from "./topLevelNode";

const hasExportKeyword = (node: Node): boolean => {
    return node
        .modifiers
        ?.some(
            (modifier) => modifier.kind === SyntaxKind.ExportKeyword
        )
        ?? false;
};

const hasConstKeyword = (node: Node): boolean => {
    return node
        .modifiers
        ?.some(
            (modifier) => modifier.kind === SyntaxKind.ConstKeyword
        )
        ?? false;
};

export const getTopLevelNodeKind = (
    node: Node,
): TopLevelNodeKind => {
    // TODO factor in the "export default class A {}" cases;

    if (isImportDeclaration(node)) {
        return TopLevelNodeKind.import;
    }

    if (isClassDeclaration(node)) {
        return hasExportKeyword(node)
            ? TopLevelNodeKind.exportClass
            : TopLevelNodeKind.class;
    }

    if (isTypeAliasDeclaration(node)) {
        return hasExportKeyword(node)
            ? TopLevelNodeKind.exportType
            : TopLevelNodeKind.type;
    }

    if (isInterfaceDeclaration(node)) {
        return hasExportKeyword(node)
            ? TopLevelNodeKind.exportInterface
            : TopLevelNodeKind.interface;
    }

    if (isEnumDeclaration(node)) {
        return hasExportKeyword(node)
            ? TopLevelNodeKind.exportEnum
            : TopLevelNodeKind.enum;   
    }

    if (isFunctionDeclaration(node)) {
        return hasExportKeyword(node)
            ? TopLevelNodeKind.exportFunction
            : TopLevelNodeKind.function;
    }

    if (isVariableStatement(node)) {
        const { declarationList } = node;
        const { declarations } = declarationList;

        const doesHaveExportKeyword = hasExportKeyword(node);

        if (declarations.length !== 1) {
            return doesHaveExportKeyword
                ? TopLevelNodeKind.exportManyVariables
                : TopLevelNodeKind.manyVariables;
        }

        const doesHaveConstKeyword = hasConstKeyword(declarationList);

        const arrowFunction = declarations[0]?.initializer?.kind === SyntaxKind.ArrowFunction;

        if (arrowFunction) {
            if (doesHaveConstKeyword) {
                return doesHaveExportKeyword
                    ? TopLevelNodeKind.exportConstArrowFunction
                    : TopLevelNodeKind.constArrowFunction;
            }

            return doesHaveExportKeyword
                ? TopLevelNodeKind.exportLetArrowFunction
                : TopLevelNodeKind.letArrowFunction;
        }

        if (doesHaveConstKeyword) {
            return doesHaveExportKeyword
                ? TopLevelNodeKind.exportConstVariable
                : TopLevelNodeKind.constVariable;
        }

        return doesHaveExportKeyword
            ? TopLevelNodeKind.exportLetVariable
            : TopLevelNodeKind.letVariable;
    }

    if (isBlock(node)) {
        return TopLevelNodeKind.block;
    }

    if (isExportDeclaration(node)) {
        
    }
}