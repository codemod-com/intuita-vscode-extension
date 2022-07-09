export type MoveTopLevelNodeOptions = Readonly<{
    dependencyCoefficientWeight: number,
    similarityCoefficientWeight: number,
    kindCoefficientWeight: number,
}>;

export type MoveTopLevelNodeUserCommand = Readonly<{
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName: string,
    fileText: string,
    fileLine: number,
    options: MoveTopLevelNodeOptions,
}>;

export const buildMoveTopLevelNodeUserCommand = (
    fileName: string,
    fileText: string,
    fileLine: number,
    options: MoveTopLevelNodeOptions,
): MoveTopLevelNodeUserCommand => ({
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName,
    fileText,
    fileLine,
    options,
});