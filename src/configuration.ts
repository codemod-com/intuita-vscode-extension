import * as vscode from 'vscode';
import { DEFAULT_TOP_LEVEL_NODE_KIND_ORDER, TopLevelNodeKind } from './features/moveTopLevelNode/2_factBuilders/topLevelNode';

export const enum JobBlockTrigger {
    new='new',
    newAndChanged='newAndChanged',
    all='all',
}

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const jobBlockTrigger = configuration.get<JobBlockTrigger>('jobBlockTrigger') ?? JobBlockTrigger.new;
    const topLevelNodeKindOrder = configuration.get<ReadonlyArray<TopLevelNodeKind>>('topLevelNodeKindOrder')
        ?? DEFAULT_TOP_LEVEL_NODE_KIND_ORDER;

    const saveDocumentOnJobAccept = configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

    return {
        jobBlockTrigger,
        topLevelNodeKindOrder,
        saveDocumentOnJobAccept,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;