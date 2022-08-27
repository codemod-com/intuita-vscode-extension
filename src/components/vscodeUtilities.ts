import { TextDocument, Uri, window, workspace } from "vscode";

export const getTextDocuments = (
    fileName: string,
): ReadonlyArray<TextDocument> => {
    const callback = (document: TextDocument) => {
        return document.fileName === fileName;
    };

    return window
        .visibleTextEditors
        .map(({ document}) => document)
        .concat(workspace.textDocuments)
        .filter(callback);
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
}