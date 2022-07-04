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
    return {
        kind: 'REORDER_DECLARATIONS',
        fileName: userCommand.fileName,
        noraNode: fact.noraNode,
        reorderingMap: new Map<number, number>(
            [
                [0, 2],
                [2, 0],
            ],
        ),
    };
};