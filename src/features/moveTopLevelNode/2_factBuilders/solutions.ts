import { moveElementInArray } from "../../../utilities";
import { MoveTopLevelNodeOptions } from "../1_userCommandBuilder";
import { calculateCoefficient, Coefficient } from "./coefficients";
import { TopLevelNode } from "./topLevelNode";

export type Solution = Readonly<{
    nodes: ReadonlyArray<TopLevelNode>,
    index: number,
    coefficient: Coefficient
}>;

export const calculateSolutions = (
    nodes: ReadonlyArray<TopLevelNode>,
    selectedIndex: number,
    options: MoveTopLevelNodeOptions,
): ReadonlyArray<Solution> => {
    return nodes
        .map((_, index) => {
            return moveElementInArray(
                nodes,
                selectedIndex,
                index,
            );
        })
        .map((nodes, index) => {
            return {
                nodes,
                index,
                coefficient: calculateCoefficient(nodes, options),
            };
        })
        .filter(({ coefficient }) => coefficient.coefficient < 0.5)
        .sort((a, b) => {
            return Math.sign(a.coefficient.coefficient - b.coefficient.coefficient);
        });
};