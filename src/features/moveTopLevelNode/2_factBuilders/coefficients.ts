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
    // "0" is the ideal (perfect) coefficient
    const dependency = calculateDependencyCoefficient(nodes) * dependencyCoefficientWeight;
    const similarity = calculateSimilarityCoefficient(nodes, newIndex) * similarityCoefficientWeight;
    const kind = calculateKindCoefficient(nodes) * kindCoefficientWeight;

    const weight =
        + dependencyCoefficientWeight
        + similarityCoefficientWeight
        + kindCoefficientWeight;

    const coefficient = (
        + dependency
        + similarity
        + kind
    ) / weight;

    const dependencyShare = dependency / weight;
    const similarityShare = similarity / weight;
    const kindShare = kind / weight;

    return {
        coefficient,
        dependencyShare,
        similarityShare,
        kindShare,
    };
};