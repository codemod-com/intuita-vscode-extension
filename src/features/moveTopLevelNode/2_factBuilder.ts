import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import * as ts from "typescript";
import {buildHash} from "../../utilities";

export type TopLevelNode = Readonly<{
    id: string,
    start: number,
    end: number,
}>;

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedTopLevelNodeIndex: number,
    stringNodes: ReadonlyArray<string>,
}>;

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

            return {
                id,
                start,
                end,
            };
        });

    const selectedTopLevelNodeIndex = topLevelNodes
        .findIndex(node => node.start >= fineLineStart)

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    return {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
    };
};