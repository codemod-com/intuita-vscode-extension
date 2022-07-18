import { TopLevelNode } from "./topLevelNode";

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
                    text: fileText.slice(0, topLevelNode.triviaStart),
                    topLevelNodeIndex: null,
                });
            } else {
                const previousNode = topLevelNodes[index - 1]!;

                stringNodes.push({
                    text: fileText.slice(
                        previousNode.triviaEnd + 1,
                        topLevelNode.triviaStart,
                    ),
                    topLevelNodeIndex: null,
                });
            }

            stringNodes.push({
                text: fileText.slice(topLevelNode.triviaStart, topLevelNode.triviaEnd + 1),
                topLevelNodeIndex: index,
            });

            if (index === (topLevelNodes.length - 1)) {
                stringNodes.push({
                    text: fileText.slice(topLevelNode.triviaEnd + 1),
                    topLevelNodeIndex: null,
                });
            }
        }
    );

    return stringNodes;
};