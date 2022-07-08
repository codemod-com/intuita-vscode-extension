// @ts-ignore
import * as jaroWinkler from 'jaro-winkler';
import {calculateAverage, isNeitherNullNorUndefined, moveElementInArray} from "../../utilities";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact, StringNode} from "./2_factBuilders/2_factBuilder";
import {TopLevelNode} from "./2_factBuilders/topLevelNode";

export const calculateDependencyCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    const values = nodes
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
        .map((value) => Number(value));

    return calculateAverage(values);
};

export const calculateSimilarityCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
): number => {
    const values = nodes
        .map(
        ({ identifiers }, index) => {
            const values = Array
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

                    return calculateAverage(values);
                });

            return calculateAverage(values);
        });

    return calculateAverage(values);
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
    const solutions = nodes
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
            return Math.sign(a.coefficient - b.coefficient);
        });

    return solutions[0] ?? null;
};

export type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    oldIndex: number,
    newIndex: number,
    coefficient: number,
    stringNodes: ReadonlyArray<StringNode>,
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