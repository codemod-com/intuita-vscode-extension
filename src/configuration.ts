import * as vscode from 'vscode';
import { DEFAULT_TOP_LEVEL_NODE_KIND_ORDER, TopLevelNodeKind } from './features/moveTopLevelNode/2_factBuilders/topLevelNode';

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const topLevelNodeKindOrder = configuration.get<ReadonlyArray<TopLevelNodeKind>>('topLevelNodeKindOrder')
        ?? DEFAULT_TOP_LEVEL_NODE_KIND_ORDER;

    const saveDocumentOnJobAccept = configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

    const recommendationCreationRestricted = configuration
        .get<boolean>('recommendationCreationRestriction.enabled')
        ?? false;

    const minimumLines = recommendationCreationRestricted
        ? configuration
            .get<number>('recommendationCreationRestriction.minimumLines')
            ?? 0
        : 0;

    const minimumTopLevelBlocks = configuration
        .get<number>('recommendationCreationRestriction.minimumTopLevelBlocks')
        ?? 0;

    return {
        topLevelNodeKindOrder,
        saveDocumentOnJobAccept,
        minimumLines,
        minimumTopLevelBlocks,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;