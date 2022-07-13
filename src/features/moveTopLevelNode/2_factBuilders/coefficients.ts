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

type SimilarityStructure = Readonly<{
    previousNodeCoefficient: number | null,
    nextNodeCoefficient: number | null,
}>;

export const calculateSimilarityStructure = (
    nodes: ReadonlyArray<TopLevelNode>,
    newIndex: number,
): SimilarityStructure | null => {
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

export const calculateStructuralCoefficient = (
    structure: SimilarityStructure | KindStructure
) => {
    return calculateAverage(
        [
            structure.previousNodeCoefficient,
            structure.nextNodeCoefficient
        ]
            .filter(isNeitherNullNorUndefined)
    );
};

type KindStructure = Readonly<{
    previousNodeCoefficient: number | null,
    nextNodeCoefficient: number | null,
}>;

export const calculateKindStructure = (
    nodes: ReadonlyArray<TopLevelNode>,
    newIndex: number,
): KindStructure | null => {
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
        ? Number(node.kind !== previousNode.kind)
        : null;

    const nextNodeCoefficient = nextNode !== null
        ? Number(node.kind !== nextNode.kind)
        : null;

    return {
        previousNodeCoefficient,
        nextNodeCoefficient,
    };
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

    const similarityCoefficientStructure = calculateSimilarityStructure(nodes, newIndex);
    const similarityCoefficient = similarityCoefficientStructure
        ? calculateStructuralCoefficient(similarityCoefficientStructure)
        : 0;

    const similarityShare = (
        similarityCoefficient * similarityCoefficientWeight
    ) / weight;

    const kindCoefficientStructure = calculateKindStructure(nodes, newIndex);

    const kindCoefficient = kindCoefficientStructure
        ? calculateStructuralCoefficient(kindCoefficientStructure)
        : 0;

    const kindShare = (
        kindCoefficient * kindCoefficientWeight
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