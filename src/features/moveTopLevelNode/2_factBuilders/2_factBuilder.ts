import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {buildJavaTopLevelNodes} from "./javaFactBuilder";
import {buildTypeScriptTopLevelNodes} from "./typeScriptFactBuilder";
import {TopLevelNode} from "./topLevelNode";

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedTopLevelNodeIndex: number,
    stringNodes: ReadonlyArray<StringNode>,
}>;

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
        .findIndex(node => node.start <= fineLineStart && fineLineStart <= node.end );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    return {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
    };
};