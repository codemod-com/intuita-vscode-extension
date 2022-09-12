import { isBlock, isClassDeclaration, isEnumDeclaration, isExportDeclaration, isFunctionDeclaration, isImportDeclaration, isInterfaceDeclaration, isTypeAliasDeclaration, isVariableStatement, Node, SyntaxKind } from "typescript";
import { TopLevelNodeKind, TopLevelNodeModifier } from "./topLevelNode";

const hasExportKeyword = (node: Node): boolean => {
    return node
        .modifiers
        ?.some(
            (modifier) => modifier.kind === SyntaxKind.ExportKeyword
        )
        ?? false;
};

const hasDefaultKeyword = (node: Node): boolean => {
    return node
        .modifiers
        ?.some(
            (modifier) => modifier.kind === SyntaxKind.DefaultKeyword
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

const getModifier = (
    {
        exportKeyword,
        defaultKeyword,
    }: Readonly<{
        exportKeyword: boolean,
        defaultKeyword: boolean,
    }>
): TopLevelNodeModifier => {
    if (!exportKeyword) {
        return TopLevelNodeModifier.none;
    }

    return defaultKeyword
        ? TopLevelNodeModifier.defaultExport
        : TopLevelNodeModifier.export;
};

export const getTopLevelNodeProperties = (
    node: Node,
): Readonly<{
    modifier: TopLevelNodeModifier
    kind: TopLevelNodeKind,
}> => {
    if (isImportDeclaration(node)) {
        return {
            modifier: TopLevelNodeModifier.import,
            kind: TopLevelNodeKind.import,
        };
    }

    if (
        isClassDeclaration(node)
        || isInterfaceDeclaration(node)
        || isFunctionDeclaration(node)
    ) {
        const exportKeyword = hasExportKeyword(node);
        const defaultKeyword = hasDefaultKeyword(node);

        const modifier = getModifier({
            exportKeyword,
            defaultKeyword,
        });

        const kind = isClassDeclaration(node)
            ? TopLevelNodeKind.class
            : isInterfaceDeclaration(node)
            ? TopLevelNodeKind.interface
            : TopLevelNodeKind.function;

        return {
            modifier,
            kind,
        };
    }

    if (isTypeAliasDeclaration(node) || isEnumDeclaration(node)) {
        // type aliases cannot be default exported
        const exportKeyword = hasExportKeyword(node);

        const modifier = getModifier({
            exportKeyword,
            defaultKeyword: false,
        });

        const kind = isTypeAliasDeclaration(node)
            ? TopLevelNodeKind.type
            : TopLevelNodeKind.enum;

        return {
            modifier,
            kind,
        };
    }

    if (isVariableStatement(node)) {
        const { declarationList } = node;
        const { declarations } = declarationList;

        const exportKeyword = hasExportKeyword(node);

        const modifier = getModifier({
            exportKeyword,
            defaultKeyword: false,
        });

        if (declarations.length !== 1) {
            return {
                kind: TopLevelNodeKind.multipleVariables,
                modifier,
            };
        }

        const constKeyword = hasConstKeyword(declarationList);

        const arrowFunction = declarations[0]?.initializer?.kind === SyntaxKind.ArrowFunction;

        if (arrowFunction) {
            return {
                modifier,
                kind: constKeyword
                    ? TopLevelNodeKind.constArrowFunction
                    : TopLevelNodeKind.letArrowFunction,
            };
        }

        return {
            modifier,
            kind: constKeyword
                ? TopLevelNodeKind.constVariable
                : TopLevelNodeKind.letVariable,
        };
    }

    if (isBlock(node)) {
        return {
            modifier: TopLevelNodeModifier.none,
            kind: TopLevelNodeKind.block,
        }
    }

    if (isExportDeclaration(node)) {
        const defaultKeyword = hasDefaultKeyword(node);

        const modifier = getModifier({
            exportKeyword: true,
            defaultKeyword,
        });

        return {
            modifier,
            kind: TopLevelNodeKind.export,
        };
    }

    return {
        modifier: TopLevelNodeModifier.none,
        kind: TopLevelNodeKind.unknown,
    }
}
