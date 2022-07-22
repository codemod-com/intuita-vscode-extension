import { isNeitherNullNorUndefined, moveElementInArray } from "../../../utilities";
import { MoveTopLevelNodeOptions } from "../1_userCommandBuilder";
import { calculateCoefficient, Coefficient } from "./coefficients";
import { TopLevelNode } from "./topLevelNode";

export type Solution = Readonly<{
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    newIndex: number,
    coefficient: Coefficient
}>;

export const calculateSolutions = (
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    options: MoveTopLevelNodeOptions,
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
            const coefficient = calculateCoefficient(
                newNodes,
                newIndex,
                options
            );

            return {
                nodes: newNodes,
                oldIndex,
                newIndex,
                coefficient,
            };
        })
        .sort((a, b) => {
            return Math.sign(a.coefficient.coefficient - b.coefficient.coefficient);
        });
};