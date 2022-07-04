import {ReorderDeclarationsAstCommand} from "./astCommandBuilder";
import {NoraNode} from "./factBuilder";
import {SourceFileExecution} from "../../utilities";

export const executeReorderDeclarationsAstCommand = (
    command: ReorderDeclarationsAstCommand,
): ReadonlyArray<SourceFileExecution> => {
    const replaceChildrenOrder = (
        noraNode: NoraNode,
        replacementMap: ReadonlyMap<number, number>,
    ): NoraNode => {
        if (!('children' in noraNode)) {
            return noraNode;
        }

        const children = noraNode.children.slice();

        replacementMap.forEach(
            (value, key) => {
                children[key] = noraNode.children[value]!;
            }
        );

        return {
            ...noraNode,
            children,
        };
    };

    const getNoraNodeFullText = (noraNode: NoraNode): string => {
        if ('node' in noraNode) {
            return noraNode.node.getFullText();
        }

        return noraNode
            .children
            .map(
                (childNode) => getNoraNodeFullText(childNode)
            )
            .join('');
    };

    const newNoraNode = replaceChildrenOrder(
        command.noraNode,
        command.reorderingMap,
    );

    const text = getNoraNodeFullText(newNoraNode);

    return [
        {
            name: command.fileName,
            text,
        }
    ]
};