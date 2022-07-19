import * as vscode from 'vscode';

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const dependencyCoefficientWeight = configuration.get<number>('dependencyCoefficientWeight') ?? 1;
    const similarityCoefficientWeight = configuration.get<number>('similarityCoefficientWeight') ?? 1;
    const kindCoefficientWeight = configuration.get<number>('kindCoefficientWeight') ?? 1;

    return {
        dependencyCoefficientWeight,
        similarityCoefficientWeight,
        kindCoefficientWeight,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;