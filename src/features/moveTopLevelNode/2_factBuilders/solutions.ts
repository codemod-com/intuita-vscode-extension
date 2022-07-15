import { moveElementInArray } from "../../../utilities";
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
            return moveElementInArray(
                nodes,
                oldIndex,
                newIndex,
            );
        })
        .map((nodes, newIndex) => {
            const coefficient = calculateCoefficient(
                nodes,
                newIndex,
                options
            );

            return {
                nodes,
                oldIndex,
                newIndex,
                coefficient,
            };
        })
        .sort((a, b) => {
            return Math.sign(a.coefficient.coefficient - b.coefficient.coefficient);
        });
};