// @ts-ignore
import * as jaroWinkler from 'jaro-winkler';
import {calculateAverage, isNeitherNullNorUndefined, moveElementInArray} from "../../utilities";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact, TopLevelNode} from "./2_factBuilder";

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
                                .from(node.identifiers)
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

export const calculateSimilarityCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    if (nodes.length === 0) {
        return 0;
    }

    const sum = nodes
        .map(
        ({ identifiers }, index) => {
            if (identifiers.size === 0) {
                return 0;
            }

            const sum = Array
                .from(identifiers)
                .map((identifier) => {
                    const values = [
                        nodes[index - 1] ?? null,
                        nodes[index + 1] ?? null,
                    ]
                        .filter(isNeitherNullNorUndefined)
                        .flatMap(
                            (node) => Array.from(node.identifiers),
                        )
                        .map(
                            (otherIdentifier) => {
                                return 1 - jaroWinkler(identifier, otherIdentifier);
                            }
                        );

                    if (values.length === 0) {
                        return 0;
                    }

                    const sum = values
                        .reduce((a, b) => a + b, 0);

                    return sum / values.length;
                })
                .reduce((a, b) => a + b, 0);

            return sum / identifiers.size;
        })
        .reduce((a, b) => a + b, 0);

    return sum / nodes.length;
};

export const calculateKindCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    if (nodes.length === 0) {
        return 0;
    }

    const values = nodes.map(
        ({ kind }, index) => {
            const values = [
                nodes[index - 1] ?? null,
                nodes[index + 1] ?? null,
            ]
                .filter(isNeitherNullNorUndefined)
                .map(otherNode => otherNode.kind !== kind)
                .map(value => Number(value));

            return calculateAverage(values);
        }
    );

    return calculateAverage(values);
};

export const calculateCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    // "0" is the ideal (perfect) coefficient
    return (
        + calculateDependencyCoefficient(nodes)
        + calculateSimilarityCoefficient(nodes)
        + calculateKindCoefficient(nodes)
    ) / 3;
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