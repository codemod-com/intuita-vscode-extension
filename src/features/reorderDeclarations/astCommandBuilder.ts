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
): ReadonlyMap<string, CallableMetadata> => {
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

            return Array.from(childNode.identifiers)
                .map(
                    (identifier) => {
                        return [
                            identifier,
                            {
                                nonCallableNames: [],
                                callableNames: childIdentifiers,
                                mutability: Mutability.READING_READONLY,
                                empty: false,
                            }
                        ] as const;
                    }
                );
        })
        .filter(isNeitherNullNorUndefined)
        .flat();

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

    // basic move-by-one algorithm
    const reorderingMap = new Map<number, number>(
        indices.map(
            (value, index) => ([
                value.index,
                indices[index+1]?.index ?? indices[0]?.index ?? 0,
            ]),
        ),
    );

    return {
        kind: 'REORDER_DECLARATIONS',
        fileName: userCommand.fileName,
        noraNode: fact.noraNode,
        reorderingMap,
    };
};