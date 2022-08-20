import * as vscode from 'vscode';

export const enum JobBlockTrigger {
    new=1,
    newAndChanged=2,
    all=3,
}

const getJobBlockTrigger = (
    str: string,
): JobBlockTrigger => {
    if (str === 'newAndChanged') {
        return JobBlockTrigger.newAndChanged;
    }

    if (str === 'all') {
        return JobBlockTrigger.all;
    }

    return JobBlockTrigger.new;
};

export const getConfiguration = () => {
    const configuration = vscode.workspace.getConfiguration(
        'intuita',
    );

    const jobBlockTrigger = getJobBlockTrigger(
        configuration.get<string>('jobBlockTrigger') ?? 'new'
    );

    return {
        jobBlockTrigger,
    };
};

export type Configuration = ReturnType<typeof getConfiguration>;