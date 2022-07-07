import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import * as ts from "typescript";
import {buildHash} from "../../utilities";
import {createHash} from "crypto";

export type TopLevelNode = Readonly<{
    id: string,
    start: number,
    end: number,
    identifiers: Set<string>,
    childIdentifiers: Set<string>,
}>;

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedTopLevelNodeIndex: number,
    stringNodes: ReadonlyArray<string>,
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

export const getStringNodes = (
    fileText: string,
    topLevelNodes: ReadonlyArray<TopLevelNode>
): ReadonlyArray<string> => {
    const stringNodes: string[] = [];

    topLevelNodes.forEach(
        (topLevelNode, index) => {
            if (index === 0) {
                stringNodes.push(
                    fileText.slice(0, topLevelNode.start),
                );
            } else {
                const previousNode = topLevelNodes[index - 1]!;

                stringNodes.push(
                    fileText.slice(
                        previousNode.end + 1,
                        topLevelNode.start,
                    )
                );
            }

            stringNodes.push(
                fileText.slice(topLevelNode.start, topLevelNode.end + 1),
            );

            if (index === (topLevelNodes.length - 1)) {
                stringNodes.push(
                    fileText.slice(topLevelNode.end + 1),
                );
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

    const sourceFile = ts.createSourceFile(
        fileName,
        fileText,
        ts.ScriptTarget.ES5,
        true
    );

    const topLevelNodes = sourceFile
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.SyntaxList)
        .flatMap((node) => node.getChildren())
        .filter(node => {
            return ts.isClassDeclaration(node)
                || ts.isFunctionDeclaration(node)
                || ts.isInterfaceDeclaration(node)
                || ts.isInterfaceDeclaration(node)
                || ts.isTypeAliasDeclaration(node)
                || ts.isBlock(node)
                || ts.isVariableStatement(node);
        })
        .map((node) => {
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
                id,
                start,
                end,
                identifiers,
                childIdentifiers,
            };
        });

    const selectedTopLevelNodeIndex = topLevelNodes
        .findIndex(node => node.start >= fineLineStart);

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    return {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
    };
};