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

export type Coefficient = Readonly<{
    coefficient: number,
    dependencyShare: number,
    similarityShare: number,
    kindShare: number,
}>;

export const calculateCoefficient = (
    nodes: ReadonlyArray<TopLevelNode>,
    {
        dependencyCoefficientWeight,
        similarityCoefficientWeight,
        kindCoefficientWeight,
    }: MoveTopLevelNodeOptions,
): Coefficient => {
    // "0" is the ideal (perfect) coefficient
    const dependency = calculateDependencyCoefficient(nodes) * dependencyCoefficientWeight;
    const similarity = calculateSimilarityCoefficient(nodes) * similarityCoefficientWeight;
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