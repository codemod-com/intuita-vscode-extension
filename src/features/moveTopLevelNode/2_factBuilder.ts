import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import * as ts from "typescript";
import {buildHash} from "../../utilities";
import {createHash} from "crypto";
import {buildJavaTopLevelNodes} from "./2_factBuilders/javaFactBuilder";
import {buildTypeScriptTopLevelNodes} from "./2_factBuilders/typeScriptFactBuilder";

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
        topLevelNodes = buildTypeScriptTopLevelNodes(fileName, fileText);
    }

    if (fileName.endsWith('.java')) {
        topLevelNodes = buildJavaTopLevelNodes(fileText);
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