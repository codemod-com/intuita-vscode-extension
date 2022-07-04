export type ReorderDeclarationsUserCommand = Readonly<{
    kind: 'REORDER_DECLARATIONS',
    fileName: string,
    fileText: string,
}>;

export const buildReorderDeclarationsUserCommand = (
    fileName: string,
    fileText: string,
): ReorderDeclarationsUserCommand => ({
    kind: 'REORDER_DECLARATIONS',
    fileName,
    fileText,
});
