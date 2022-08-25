import * as vscode from 'vscode';
import { DEFAULT_TOP_LEVEL_NODE_KIND_ORDER, TopLevelNodeKind } from './features/moveTopLevelNode/2_factBuilders/topLevelNode';

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const topLevelNodeKindOrder = configuration.get<ReadonlyArray<TopLevelNodeKind>>('topLevelNodeKindOrder')
        ?? DEFAULT_TOP_LEVEL_NODE_KIND_ORDER;

    const saveDocumentOnJobAccept = configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

    const minimumLines = configuration.get<number>('minimumLines') ?? 50;

    return {
        topLevelNodeKindOrder,
        saveDocumentOnJobAccept,
        minimumLines,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;