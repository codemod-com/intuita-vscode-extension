import {NoraNode, ReorderDeclarationFact} from "./factBuilder";
import {ReorderDeclarationsUserCommand} from "./userCommandBuilder";

export type ReorderDeclarationsAstCommand = Readonly<{
    kind: 'REORDER_DECLARATIONS',
    fileName: string,
    noraNode: NoraNode,
    reorderingMap: ReadonlyMap<number, number>,
}>;

export const buildReorderDeclarationsAstCommand = (
    userCommand: ReorderDeclarationsUserCommand,
    fact: ReorderDeclarationFact,
): ReorderDeclarationsAstCommand => {
    const { indices } = fact;

    // basic move-by-one algorithm
    const reorderingMap = new Map<number, number>(
        indices.map(
            (value, index) => ([
                value,
                indices[index+1] ?? indices[0] ?? 0,
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