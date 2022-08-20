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

    const recommendationBlockTrigger = getRecommendationBlockTrigger(
        configuration.get<string>('recommendationBlockTrigger') ?? 'onlyNew'
    );

    return {
        recommendationBlockTrigger,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;