import * as ts from "typescript";
import {buildHash} from "../../../utilities";
import {TopLevelNode, TopLevelNodeKind} from "./topLevelNode";
import {createHash} from "crypto";

const getTopLevelNodeKind = (kind: ts.SyntaxKind): TopLevelNodeKind => {
    switch(kind) {
        case ts.SyntaxKind.ClassDeclaration:
            return TopLevelNodeKind.CLASS;
        case ts.SyntaxKind.FunctionDeclaration:
            return TopLevelNodeKind.FUNCTION;
        case ts.SyntaxKind.InterfaceDeclaration:
            return TopLevelNodeKind.INTERFACE;
        case ts.SyntaxKind.TypeAliasDeclaration:
            return TopLevelNodeKind.TYPE_ALIAS;
        case ts.SyntaxKind.Block:
            return TopLevelNodeKind.BLOCK;
        case ts.SyntaxKind.VariableStatement:
            return TopLevelNodeKind.VARIABLE;
        case ts.SyntaxKind.EnumDeclaration:
            return TopLevelNodeKind.ENUM;
        default:
            return TopLevelNodeKind.UNKNOWN;
    }
};

export const getChildIdentifiers = (
    node: ts.Node
): ReadonlyArray<string> => {
    if (ts.isIdentifier(node)) {
        return [node.text];
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
    if (
        ts.isClassDeclaration(node)
        || ts.isFunctionDeclaration(node)
    ) {
        const text = node.name?.text ?? null;

        if (text === null) {
            return [];
        }

        return [text];
    }

    if (
        ts.isInterfaceDeclaration(node)
        || ts.isInterfaceDeclaration(node)
        || ts.isTypeAliasDeclaration(node)
        || ts.isEnumDeclaration(node)
    ) {
        return [node.name.text];
    }

    if (ts.isBlock(node)) {
        const hash = createHash('ripemd160')
            .update(
                node.getFullText(),
            )
            .digest('base64url');

        return [
            hash,
        ];
    }

    if (ts.isVariableStatement(node)) {
        return node
            .declarationList
            .declarations
            .map(
                ({name}) => name
            )
            .filter(ts.isIdentifier)
            .map(({text}) => text);
    }

    return [];
};
export const buildTypeScriptTopLevelNodes = (
    fileName: string,
    fileText: string,
): ReadonlyArray<TopLevelNode> => {
    const sourceFile = ts.createSourceFile(
        fileName,
        fileText,
        ts.ScriptTarget.ES5,
        true
    );

    return sourceFile
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.SyntaxList)
        .flatMap((node) => node.getChildren())
        .filter(node => {
            return ts.isClassDeclaration(node)
                || ts.isFunctionDeclaration(node)
                || ts.isInterfaceDeclaration(node)
                || ts.isTypeAliasDeclaration(node)
                || ts.isBlock(node)
                || ts.isVariableStatement(node)
                || ts.isEnumDeclaration(node);
        })
        .map((node) => {
            const kind = getTopLevelNodeKind(node.kind);

            const nodeStart = node.getStart();
            const nodeEnd = node.getEnd();

            const start = ts.getLeadingCommentRanges(
                fileText,
                node.getFullStart()
            )
                ?.map(range => range.pos)
                ?.reduce((a, b) => a < b ? a : b, nodeStart)
                ?? nodeStart;

            const end = ts.getTrailingCommentRanges(
                fileText,
            node.getEnd()+1
            )
                ?.map(range => range.end)
                ?.reduce((a, b) => a > b ? a : b, nodeEnd)
                ?? nodeEnd;

            const text = fileText.slice(start, end);

            const id = buildHash(text);

            // extract identifiers:
            const identifiers = new Set(getIdentifiers(node));
            const childIdentifiers = new Set(getChildIdentifiers(node));

            identifiers.forEach((identifier) => {
                childIdentifiers.delete(identifier);
            });

            return {
                kind,
                id,
                start,
                end,
                identifiers,
                childIdentifiers,
            };
        });
};