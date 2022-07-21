// @ts-ignore
import * as jaroWinkler from 'jaro-winkler';
import { calculateAverage, isNeitherNullNorUndefined } from "../../../utilities";
import { MoveTopLevelNodeOptions } from '../1_userCommandBuilder';
import { TopLevelNode } from "./topLevelNode";
import {tokenize} from "../../../tokenizer/tokenizer";

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
                        const leftTokens = new Set(tokenize(leftIdentifier));
                        const rightTokens = new Set(tokenize(rightIdentifier));

                        const leftValues = Array.from(leftTokens.values())
                            .map((token) => rightTokens.has(token))
                            .map((value) => 1 - Number(value));

                        const rightValues = Array.from(rightTokens.values())
                            .map((token) => leftTokens.has(token))
                            .map((value) => 1 - Number(value));

                        const tokenValue = 0.5 * calculateAverage(leftValues)
                            + 0.5 * calculateAverage(rightValues);

                        const jwValue = 1 - jaroWinkler(leftIdentifier, rightIdentifier);

                        return Math.min(tokenValue, jwValue);
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
    dependencyCoefficient: number,
    similarityCoefficient: number,
    kindCoefficient: number,
    similarityStructure: SimilarityStructure | null,
    kindStructure: KindStructure | null,
}>;

export const calculateCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
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
    const dependencyCoefficient = (
        calculateDependencyCoefficient(nodes) * dependencyCoefficientWeight
    ) / weight;

    const similarityStructure = calculateSimilarityStructure(nodes, newIndex);
    const kindStructure = calculateKindStructure(nodes, newIndex);

    const similarityCoefficient = (
        (
            similarityStructure
                ? calculateStructuralCoefficient(similarityStructure)
                : 0
        ) * similarityCoefficientWeight
    ) / weight;

    const kindCoefficient = (
        (
            kindStructure
                ? calculateStructuralCoefficient(kindStructure)
                : 0
        ) * kindCoefficientWeight
    ) / weight;

    const coefficient = (
        + dependencyCoefficient
        + similarityCoefficient
        + kindCoefficient
    );

    return {
        coefficient,
        dependencyCoefficient,
        similarityCoefficient,
        kindCoefficient,
        similarityStructure,
        kindStructure,
    };
};