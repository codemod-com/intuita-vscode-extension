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

        const jobs = this._jobManager.getCodeActionJobs(
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
}
