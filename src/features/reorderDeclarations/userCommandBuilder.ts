export type ReorderDeclarationsUserCommand = Readonly<{
    kind: 'REORDER_DECLARATIONS',
    fileName: string,
}>;

export const buildReorderDeclarationsUserCommand = (
    fileName: string
): ReorderDeclarationsUserCommand => ({
    kind: 'REORDER_DECLARATIONS',
    fileName,
});
