import { moveElementInArray } from "../../utilities";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact, TopLevelNode} from "./2_factBuilder";

/*
for the new nodes (m0, m1, m2, ..., mn)
for each node, calculate if the name before it and above it is similar (between 0-1)
for each base interface, calculate how far its extensions are (0-1)
sum all values up with the same weights (we can alter it in the future)
 */

export const calculateDependencyCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    const { length } = nodes;

    if (length === 0) {
        return 0;
    }

    const sum = nodes
        .map(
            ({ childIdentifiers }, index) => {
                return nodes
                    .slice(index)
                    .some(
                        (node) => {
                            return Array
                                .from(node.identifiers.values())
                                .some(
                                    (identifier) => childIdentifiers.has(identifier)
                                );
                        }
                    );
            }
        )
        .map((value) => Number(value))
        .reduce((a, b) => a + b, 0);

    return sum / length;
};

export const calculateCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    // "0" is the ideal (perfect) coefficient
    return calculateDependencyCoefficient(nodes);
};

const calculateSolution = (
    nodes: ReadonlyArray<TopLevelNode>,
    selectedIndex: number,
) => {
    return (new Array(nodes.length))
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
                coefficient: calculateCoefficient(nodes),
            };
        })
        .sort((a, b) => {
            return Math.sign(b.coefficient - a.coefficient);
        })
        [0] ?? null;
};

type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    oldIndex: number,
    newIndex: number,
    coefficient: number,
    stringNodes: ReadonlyArray<string>,
}>;

export const buildMoveTopLevelNodeAstCommand = (
    {
        fileName,
    }: MoveTopLevelNodeUserCommand,
    {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        stringNodes,
    }: MoveTopLevelNodeFact,
): MoveTopLevelNodeAstCommand | null => {
    if (topLevelNodes.length === 0 || selectedTopLevelNodeIndex === -1) {
        return null;
    }

    const solution = calculateSolution(
        topLevelNodes,
        selectedTopLevelNodeIndex,
    );

    if (solution === null) {
        return null;
    }

    return {
        kind: "MOVE_TOP_LEVEL_NODE",
        fileName,
        oldIndex: selectedTopLevelNodeIndex,
        newIndex: solution.index,
        coefficient: solution.coefficient,
        stringNodes,
    };
};