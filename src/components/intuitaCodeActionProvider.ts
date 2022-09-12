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
import {IntuitaPosition} from "../utilities";
import {buildFileNameHash} from "../features/moveTopLevelNode/fileNameHash";
import { JobHash } from "../features/moveTopLevelNode/jobHash";
import {buildFileUri, buildJobUri} from "../fileSystems/uris";

interface Job {
    hash: JobHash,
    title: string
}

interface JobManager {
    getCodeActionJobs(
        stringUri: string,
        position: IntuitaPosition,
    ): ReadonlyArray<Job & { characterDifference: number }>;
}

export class IntuitaCodeActionProvider implements CodeActionProvider {
    public constructor(
        protected readonly _jobManager: JobManager,
    ) {

    }

    provideCodeActions(
        document: TextDocument,
        range: Range | Selection,
    ): ProviderResult<(Command | CodeAction)[]> {
        const stringUri = document.uri.toString();

        const jobs = this._jobManager.getCodeActionJobs(
            stringUri,
            [
                range.start.line,
                range.start.character,
            ]
        );

        const fileNameHash = buildFileNameHash(stringUri);

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
                        buildFileUri(fileNameHash),
                        buildJobUri(job.hash),
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
