// @ts-ignore
import * as jaroWinkler from 'jaro-winkler';
import { calculateAverage, isNeitherNullNorUndefined } from "../../../utilities";
import { MoveTopLevelNodeOptions } from '../1_userCommandBuilder';
import { TopLevelNode } from "./topLevelNode";

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

export const calculateNodesSimilarityCoefficient = (
    leftNode: TopLevelNode,
    rightNode: TopLevelNode,
): number => {
    const leftIdentifiers = Array.from(leftNode.identifiers);
    const rightIdentifiers = Array.from(rightNode.identifiers);

    const values = leftIdentifiers
        .flatMap(
            (leftIdentifier) => {
                return rightIdentifiers.map(
                    (rightIdentifier) => {
                        return 1 - jaroWinkler(leftIdentifier, rightIdentifier);
                    }
                )
            }
        );

    return calculateAverage(values);
}

export const calculateSimilarityCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
    newIndex: number,
): number => {
    if (nodes.length === 0) {
        return 0;
    }

    const node = nodes[newIndex] ?? null;

    if (node === null) {
        // this should not happen
        return 1;
    }

    const previousNode = nodes[newIndex - 1] ?? null;
    const nextNode     = nodes[newIndex + 1] ?? null;

    const coefficients = [
        previousNode,
        nextNode,
    ]
        .filter(isNeitherNullNorUndefined)
        .map((otherNode) => calculateNodesSimilarityCoefficient(node, otherNode))
        
    // 

    return calculateAverage(coefficients);
};

export const calculateKindCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
    newIndex: number,
): number => {
    if (nodes.length === 0) {
        return 0;
    }

    const node = nodes[newIndex] ?? null;

    if (node === null) {
        // this should not happen
        return 1;
    }

    const previousNode = nodes[newIndex - 1] ?? null;
    const nextNode     = nodes[newIndex + 1] ?? null;

    const values = [
        previousNode,
        nextNode,
    ]
        .filter(isNeitherNullNorUndefined)
        .map(otherNode => otherNode.kind !== node.kind)
        .map(value => Number(value));

    return calculateAverage(values);
};

export type Coefficient = Readonly<{
    coefficient: number,
    dependencyShare: number,
    similarityShare: number,
    kindShare: number,
}>;

export const calculateCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
    oldIndex: number,
    newIndex: number,
    {
        dependencyCoefficientWeight,
        similarityCoefficientWeight,
        kindCoefficientWeight,
    }: MoveTopLevelNodeOptions,
): Coefficient => {
    const weight =
        + dependencyCoefficientWeight
        + similarityCoefficientWeight
        + kindCoefficientWeight;

    // "0" is the ideal (perfect) coefficient
    const dependencyShare = (
        calculateDependencyCoefficient(nodes) * dependencyCoefficientWeight
    ) / weight;

    const similarityShare = (
        calculateSimilarityCoefficient(nodes, newIndex) * similarityCoefficientWeight
    ) / weight;

    const kindShare = (
        calculateKindCoefficient(nodes, newIndex) * kindCoefficientWeight
    ) / weight;

    const coefficient = (
        + dependencyShare
        + similarityShare
        + kindShare
    );

    return {
        coefficient,
        dependencyShare,
        similarityShare,
        kindShare,
    };
};