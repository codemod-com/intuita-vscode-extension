import { TextDocument, Uri, window, workspace } from "vscode";

const getTextDocuments = (
    fileName: string,
): ReadonlyArray<TextDocument> => {
    return window
        .visibleTextEditors
        .map(({ document}) => document)
        .concat(workspace.textDocuments)
        .filter((document) => {
            return document.fileName === fileName;
        });
};

export const getOrOpenTextDocuments = async (
    fileName: string
): Promise<ReadonlyArray<TextDocument>> => {
    const textDocuments = getTextDocuments(fileName);

    if (textDocuments.length) {
        return textDocuments;
    }

    const openedTextDocument = await workspace.openTextDocument(
        Uri.parse(fileName),
    );

    return [ openedTextDocument ];
};