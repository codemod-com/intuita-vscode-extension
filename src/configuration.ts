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

    const jobBlockTrigger = configuration.get<JobBlockTrigger>('jobBlockTrigger') ?? 'new';
    const topLevelNodeKindOrder = configuration.get<ReadonlyArray<TopLevelNodeKind>>('topLevelNodeKindOrder')
        ?? DEFAULT_TOP_LEVEL_NODE_KIND_ORDER;

    return {
        jobBlockTrigger,
        topLevelNodeKindOrder,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;