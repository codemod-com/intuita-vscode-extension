import * as vscode from 'vscode';
import { TopLevelNodeKind } from './features/moveTopLevelNode/2_factBuilders/topLevelNode';

export const enum JobBlockTrigger {
    new='new',
    newAndChanged='newAndChanged',
    all='all',
}

const DEFAULT_TOP_LEVEL_NODE_KIND_ORDER: ReadonlyArray<TopLevelNodeKind> = [
    TopLevelNodeKind.enum,
    TopLevelNodeKind.typeAlias,
    TopLevelNodeKind.interface,
    TopLevelNodeKind.function,
    TopLevelNodeKind.class,
    TopLevelNodeKind.block,
    TopLevelNodeKind.variable,
    TopLevelNodeKind.unknown,
];

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