import {NoraNode, ReorderDeclarationFact} from "./factBuilder";
import {ReorderDeclarationsUserCommand} from "./userCommandBuilder";
import {getGroupMap} from "../../intuitaExtension/getGroupMap";
import {Mutability} from "../../intuitaExtension/mutability";
import {CallableMetadata} from "../../astCommandBuilders/splitClassAstCommandBuilders";
import {isNeitherNullNorUndefined} from "../../utilities";

export type ReorderDeclarationsAstCommand = Readonly<{
    kind: 'REORDER_DECLARATIONS',
    fileName: string,
    noraNode: NoraNode,
    reorderingMap: ReadonlyMap<number, number>,
}>;

export const buildCallableMetadataMap = (
    noraNode: NoraNode,
): ReadonlyMap<ReadonlySet<string>, CallableMetadata> => {
    if (!('children' in noraNode)) {
        return new Map();
    }

    const entries = noraNode
        .children
        .map((childNode) => {
            if (!('node' in childNode)) {
                return null;
            }

            const childIdentifiers = Array.from(childNode.childIdentifiers);

            if (childNode.identifiers.size === 0) {
                return null;
            }

            return [
                childNode.identifiers,
                {
                    nonCallableNames: [],
                    callableNames: childIdentifiers,
                    mutability: Mutability.READING_READONLY,
                    empty: false,
                },
            ] as const;
        })
        .filter(isNeitherNullNorUndefined);

    return new Map(entries);
};

export const buildReorderDeclarationsAstCommand = (
    userCommand: ReorderDeclarationsUserCommand,
    fact: ReorderDeclarationFact,
): ReorderDeclarationsAstCommand => {
    const { indices, noraNode } = fact;

    const callableMetadataMap = buildCallableMetadataMap(noraNode);

    const groupMap = getGroupMap(
        callableMetadataMap,
        null,
    );

    const selectedIndices = Array.from(groupMap.values())
        .map(({ callableNames }) => callableNames)
        .flatMap((callableNames) => {
            return callableNames
                .map(
                    name => indices.find(({ identifiers }) => identifiers.has(name))
                )
                .filter(isNeitherNullNorUndefined)
                .map(({ index }) => index);
        });

    // basic move-by-one algorithm
    const reorderingMap = new Map<number, number>(
        selectedIndices.map(
            (value, index) => ([
                indices[index]?.index ?? 0,
                value,
            ])
        ),
    );

    return {
        kind: 'REORDER_DECLARATIONS',
        fileName: userCommand.fileName,
        noraNode: fact.noraNode,
        reorderingMap,
    };
};