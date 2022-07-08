import * as ts from "typescript";
import {buildHash} from "../../../utilities";
import {getChildIdentifiers, getIdentifiers, TopLevelNode, TopLevelNodeKind} from "../2_factBuilder";

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

            const start = node.getStart();
            const end = start + node.getWidth() - 1;

            const text = fileText.slice(start, end + 1);

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