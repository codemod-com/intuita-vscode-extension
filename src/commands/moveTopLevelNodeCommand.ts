import {JobHash} from "../features/moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, calculateLastPosition, getSeparator, IntuitaRange} from "../utilities";
import {Position, Range, Selection, TextEditor, TextEditorRevealType, window, workspace} from "vscode";
import {ExtensionStateManager} from "../features/moveTopLevelNode/extensionStateManager";
import {IntuitaFileSystem} from "../fileSystems/intuitaFileSystem";
import {Container} from "../container";
import {Configuration} from "../configuration";
import {buildJobUri} from "../fileSystems/uris";
import {JobOutput} from "../jobs";

export const buildMoveTopLevelNodeCommand = (
    configurationContainer: Container<Configuration>,
    intuitaFileSystem: IntuitaFileSystem,
    extensionStateManager: ExtensionStateManager,
) => {
    const getJobOutput = (
        jobHash: JobHash,
    ): JobOutput | null => {
        const content = intuitaFileSystem.readNullableFile(
            buildJobUri(jobHash as JobHash),
        );

        if (!content) {
            return extensionStateManager
                .executeJob(
                    jobHash,
                    0,
                );
        }

        const text = content.toString();
        const separator = getSeparator(text);

        const position = calculateLastPosition(text, separator);

        const range: IntuitaRange = [
            0,
            0,
            position[0],
            position[1],
        ];


        return {
            text,
            position,
            range,
        };
    };

    return async (jobHash: unknown, characterDifference: unknown) => {
        if (typeof jobHash !== 'string') {
            throw new Error('The job hash argument must be a string.');
        }

        if (typeof characterDifference !== 'number') {
            throw new Error('The job hash argument must be a number.');
        }

        const fileName = extensionStateManager.getFileNameFromJobHash(jobHash as JobHash);

        assertsNeitherNullOrUndefined(fileName);

        const result = getJobOutput(jobHash as JobHash);

        assertsNeitherNullOrUndefined(result);

        const textEditors = window
            .visibleTextEditors
            .filter(
                ({ document }) => {
                    return document.fileName === fileName;
                },
            );

        const textDocuments = workspace
            .textDocuments
            .filter(
                (document) => {
                    return document.fileName === fileName;
                },
            );

        const activeTextEditor = window.activeTextEditor ?? null;

        const range = new Range(
            new Position(
                result.range[0],
                result.range[1],
            ),
            new Position(
                result.range[2],
                result.range[3],
            ),
        );

        const {
            saveDocumentOnJobAccept,
        } = configurationContainer.get();

        const changeTextEditor = async (textEditor: TextEditor) => {
            await textEditor.edit(
                (textEditorEdit) => {
                    textEditorEdit.replace(
                        range,
                        result.text,
                    );
                }
            );

            if (!saveDocumentOnJobAccept) {
                return;
            }

            return textEditor.document.save();
        };

        await Promise.all(
            textEditors.map(
                changeTextEditor,
            )
        );

        if (textEditors.length === 0) {
            textDocuments.forEach(
                (textDocument) => {
                    window
                        // TODO we can add a range here
                        .showTextDocument(textDocument)
                        .then(
                            changeTextEditor,
                        );
                }
            );
        }

        if (activeTextEditor?.document.fileName === fileName) {
            const position = new Position(
                result.position[0],
                result.position[1],
            );

            const selection = new Selection(
                position,
                position
            );

            activeTextEditor.selections = [ selection ];

            activeTextEditor.revealRange(
                new Range(
                    position,
                    position
                ),
                TextEditorRevealType.AtTop,
            );
        }

        const allTextDocuments = textEditors
            .map(({ document }) => document)
            .concat(
                textDocuments
            );

        if (allTextDocuments[0]) {
            extensionStateManager
                .onFileTextChanged(
                    allTextDocuments[0],
                );
        }
    };
};
