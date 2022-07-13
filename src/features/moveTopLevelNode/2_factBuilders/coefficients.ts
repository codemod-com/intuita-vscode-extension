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
                );
            }
        );

    return calculateAverage(values);
};

type SimilarityCoefficientStructure = Readonly<{
    previousNodeCoefficient: number | null,
    nextNodeCoefficient: number | null,
}>;

export const calculateSimilarityCoefficientStructure = (
    nodes: ReadonlyArray<TopLevelNode>,
    newIndex: number,
): SimilarityCoefficientStructure | null => {
    if (nodes.length === 0) {
        return null;
    }

    const node = nodes[newIndex] ?? null;

    if (node === null) {
        // this should not happen
        return null;
    }

    const previousNode = nodes[newIndex - 1] ?? null;
    const nextNode     = nodes[newIndex + 1] ?? null;

    const previousNodeCoefficient = previousNode !== null
        ? calculateNodesSimilarityCoefficient(node, previousNode)
        : null;

    const nextNodeCoefficient = nextNode !== null
        ? calculateNodesSimilarityCoefficient(node, nextNode)
        : null;

    return {
        previousNodeCoefficient,
        nextNodeCoefficient,
    };
};

export const calculateSimilarityCoefficient = (
    structure: SimilarityCoefficientStructure
) => {
    return calculateAverage(
        [
            structure.previousNodeCoefficient,
            structure.nextNodeCoefficient
        ]
            .filter(isNeitherNullNorUndefined)
    );
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

    const similarityCoefficientStructure = calculateSimilarityCoefficientStructure(nodes, newIndex);
    const similarityCoefficient = similarityCoefficientStructure
        ? calculateSimilarityCoefficient(similarityCoefficientStructure)
        : 0;

    const similarityShare = (
        similarityCoefficient * similarityCoefficientWeight
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