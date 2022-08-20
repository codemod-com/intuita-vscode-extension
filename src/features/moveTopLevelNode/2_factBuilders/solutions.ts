import { isNeitherNullNorUndefined, moveElementInArray } from "../../../utilities";
import { TopLevelNode } from "./topLevelNode";

export type Solution = Readonly<{
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    newIndex: number
}>;

export const calculateSolutions = (
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
): ReadonlyArray<Solution> => {
    return nodes
        .map((_, newIndex) => {
            if (oldIndex === newIndex) {
                return null;
            }

            const newNodes = moveElementInArray(
                nodes,
                oldIndex,
                newIndex,
            );

            return [newNodes, newIndex] as const;
        })
        .filter(isNeitherNullNorUndefined)
        .map(([ newNodes, newIndex ]) => {
            return {
                nodes: newNodes,
                oldIndex,
                newIndex,
            };
        });
};