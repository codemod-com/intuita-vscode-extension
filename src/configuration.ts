import { execSync } from 'node:child_process';
import { type } from 'node:os';
import * as vscode from 'vscode';
import { DEFAULT_TOP_LEVEL_NODE_KIND_ORDER, TopLevelNodeKind } from './features/moveTopLevelNode/2_factBuilders/topLevelNode';

const isJoernAvailable = () => {
    const operatingSystemName = type();

    if (operatingSystemName !== 'Linux' && operatingSystemName !== 'Darwin') {
        return false;
    }

    try {
        // execSync('which joern-parse joern-vectors');
        execSync('which joern-parse');

        return true;
    } catch {
        return false;
    }
};

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const topLevelNodeKindOrder = configuration.get<ReadonlyArray<TopLevelNodeKind>>('topLevelNodeKindOrder')
        ?? DEFAULT_TOP_LEVEL_NODE_KIND_ORDER;

    const saveDocumentOnJobAccept = configuration.get<boolean>('saveDocumentOnJobAccept') ?? true;

    const minimumLines = configuration.get<number>('minimumLines') ?? 50;

    const joernAvailable = isJoernAvailable();

    return {
        topLevelNodeKindOrder,
        saveDocumentOnJobAccept,
        minimumLines,
        joernAvailable,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;