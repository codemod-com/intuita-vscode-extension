// @ts-ignore
import * as jaroWinkler from 'jaro-winkler';
import {calculateAverage, isNeitherNullNorUndefined, moveElementInArray} from "../../utilities";
import {MoveTopLevelNodeOptions, MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
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

type Solution = Readonly<{
    nodes: ReadonlyArray<TopLevelNode>,
    index: number,

}>;

const calculateSolutions = (
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

export type MoveTopLevelNodeAstCommand = Readonly<{
    kind: "MOVE_TOP_LEVEL_NODE",
    fileName: string,
    oldIndex: number,
    solutions: ReadonlyArray<Solution>,
    stringNodes: ReadonlyArray<StringNode>,
}>;

export const buildMoveTopLevelNodeAstCommand = (
    {
        fileName,
        options,
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

    const solutions = calculateSolutions(
        topLevelNodes,
        selectedTopLevelNodeIndex,
        options,
    );

    if (solutions.length === 0) {
        return null;
    }

    return {
        kind: "MOVE_TOP_LEVEL_NODE",
        fileName,
        oldIndex: selectedTopLevelNodeIndex,
        solutions,
        stringNodes,
    };
};