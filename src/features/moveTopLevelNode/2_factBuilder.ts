import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import * as ts from "typescript";
import {buildHash} from "../../utilities";
import {createHash} from "crypto";

export const enum TopLevelNodeKind {
    UNKNOWN = 1,
    CLASS = 2,
    FUNCTION = 3,
    INTERFACE = 4,
    TYPE_ALIAS = 5,
    BLOCK = 6,
    VARIABLE = 7,
    ENUM = 8,
}

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

export type TopLevelNode = Readonly<{
    kind: TopLevelNodeKind,
    id: string,
    start: number,
    end: number,
    identifiers: ReadonlySet<string>,
    childIdentifiers: ReadonlySet<string>,
}>;

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedTopLevelNodeIndex: number,
    stringNodes: ReadonlyArray<StringNode>,
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
        || ts.isEnumDeclaration(node)
    ) {
        return [ node.name.text ];
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
                ({ name }) => name
            )
            .filter(ts.isIdentifier)
            .map(({ text }) => text);
    }

    return [];
};

export type StringNode = Readonly<{
    text: string,
    topLevelNodeIndex: number | null,
}>;

export const getStringNodes = (
    fileText: string,
    topLevelNodes: ReadonlyArray<TopLevelNode>
): ReadonlyArray<StringNode> => {
    const stringNodes: Readonly<StringNode>[] = [];

    topLevelNodes.forEach(
        (topLevelNode, index) => {
            if (index === 0) {
                stringNodes.push({
                    text: fileText.slice(0, topLevelNode.start),
                    topLevelNodeIndex: null,
                });
            } else {
                const previousNode = topLevelNodes[index - 1]!;

                stringNodes.push({
                    text: fileText.slice(
                        previousNode.end + 1,
                        topLevelNode.start,
                    ),
                    topLevelNodeIndex: null,
                });
            }

            stringNodes.push({
                text: fileText.slice(topLevelNode.start, topLevelNode.end + 1),
                topLevelNodeIndex: index,
            });

            if (index === (topLevelNodes.length - 1)) {
                stringNodes.push({
                    text: fileText.slice(topLevelNode.end + 1),
                    topLevelNodeIndex: null,
                });
            }
        }
    );

    return stringNodes;
};

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
): MoveTopLevelNodeFact => {
    const {
        fileName,
        fileText,
        fileLine,
    } = userCommand;

    const fineLineStart = fileText
        .split('\n')
        .filter((_, index) => index < fileLine)
        .map(({ length }) => length)
        .reduce((a, b) => a + b + 1, 0); // +1 for '\n'

    let topLevelNodes: ReadonlyArray<TopLevelNode> = [];

    if (fileName.endsWith('.ts')) {
        const sourceFile = ts.createSourceFile(
            fileName,
            fileText,
            ts.ScriptTarget.ES5,
            true
        );

        topLevelNodes = sourceFile
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
    }

    if (fileName.endsWith('.java')) {

    }

    const selectedTopLevelNodeIndex = topLevelNodes
        .findIndex(node => node.start >= fineLineStart);

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    return {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
    };
};