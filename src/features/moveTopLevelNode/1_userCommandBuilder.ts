export type MoveTopLevelNodeUserCommand = Readonly<{
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName: string,
    fileText: string,
    fileLine: number,
}>;

export const buildMoveTopLevelNodeUserCommand = (
    fileName: string,
    fileText: string,
    fileLine: number,
): MoveTopLevelNodeUserCommand => ({
    kind: 'MOVE_TOP_LEVEL_NODE',
    fileName,
    fileText,
    fileLine,
});