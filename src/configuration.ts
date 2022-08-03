import * as vscode from 'vscode';

export const enum RecommendationBlockTrigger {
    onlyNew=1,
    newAndChanged=2,
    all=3,
}

const getRecommendationBlockTrigger = (
    str: string,
): RecommendationBlockTrigger => {
    if (str === 'newAndChanged') {
        return RecommendationBlockTrigger.newAndChanged;
    }

    if (str === 'all') {
        return RecommendationBlockTrigger.all;
    }

    return RecommendationBlockTrigger.onlyNew;
};

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const dependencyCoefficientWeight = configuration.get<number>('dependencyCoefficientWeight') ?? 1;
    const similarityCoefficientWeight = configuration.get<number>('similarityCoefficientWeight') ?? 1;
    const kindCoefficientWeight = configuration.get<number>('kindCoefficientWeight') ?? 1;

    const recommendationBlockTrigger = getRecommendationBlockTrigger(
        configuration.get<string>('recommendationBlockTrigger') ?? 'onlyNew'
    );

    return {
        dependencyCoefficientWeight,
        similarityCoefficientWeight,
        kindCoefficientWeight,
        recommendationBlockTrigger,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;