import {
    CodeAction,
    CodeActionKind,
    CodeActionProvider,
    Command,
    ProviderResult,
    Range,
    Selection,
    TextDocument,
} from "vscode";
import {JobManager} from "./jobManager";
import {buildFileUri, buildJobUri} from "./intuitaFileSystem";
import { IntuitaPosition, isNeitherNullNorUndefined } from "../utilities";
import { buildFileNameHash } from "../features/moveTopLevelNode/fileNameHash";
import { JobKind } from "../jobs";
import { calculateCharacterDifference } from "../features/moveTopLevelNode/job";

export class IntuitaCodeActionProvider implements CodeActionProvider {
    public constructor(
        protected readonly _jobManager: JobManager,
    ) {

    }

    provideCodeActions(
        document: TextDocument,
        range: Range | Selection,
    ): ProviderResult<(Command | CodeAction)[]> {
        const fileName = document.fileName;

        const jobs = this._getCodeActionJobs(
            fileName,
            [
                range.start.line,
                range.start.character,
            ],
        );

        const codeActions = jobs.flatMap(
            (job) => {
                const quickFixCodeAction = new CodeAction(
                    job.title,
                    CodeActionKind.QuickFix,
                );

                quickFixCodeAction.command = {
                    title: job.title,
                    command: 'intuita.acceptJob',
                    arguments: [
                        job.hash,
                        job.characterDifference,
                    ],
                };

                const title = `Show the difference: ${job.title}`;

                const showDifferenceCodeAction = new CodeAction(
                    title,
                    CodeActionKind.Empty,
                );

                showDifferenceCodeAction.command = {
                    title,
                    command: 'vscode.diff',
                    arguments: [
                        buildFileUri(document.uri),
                        buildJobUri(job),
                    ],
                };

                return [
                    quickFixCodeAction,
                    showDifferenceCodeAction,
                ];
            }
        );

        return Promise.resolve(codeActions);
    }

    protected _getCodeActionJobs(
        fileName: string,
        position: IntuitaPosition,
    ) {
        const fileNameHash = buildFileNameHash(fileName);

        const jobs = this._jobManager.getFileJobs(fileNameHash);

        return jobs
            .filter(
                ({ range }) => {
                    return range[0] <= position[0]
                        && range[2] >= position[0]
                        && range[1] <= position[1]
                        && range[3] >= position[1];
                },
            )
            .map(
                (job) => {
                    const characterDifference = job.kind === JobKind.moveTopLevelNode
                        ? calculateCharacterDifference(job, position)
                        : 0;

                    return {
                        ...job,
                        characterDifference,
                    };
                }
            )
            .filter(isNeitherNullNorUndefined);
    }
}
