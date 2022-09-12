import * as vscode from 'vscode';
import {MoveTopLevelNodeJobManager} from "../features/moveTopLevelNode/moveTopLevelNodeJobManager";
import {buildFileNameHash} from '../features/moveTopLevelNode/fileNameHash';
import {buildMoveTopLevelNodeJobHash} from '../features/moveTopLevelNode/jobHash';
import {buildFileUri, buildJobUri} from '../fileSystems/uris';

export class MoveTopLevelNodeActionProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
    public constructor(
        protected _moveTopLevelNodeJobManager: MoveTopLevelNodeJobManager,
    ) {
    }

	public provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range | vscode.Selection,
	): Thenable<vscode.CodeAction[]> {
		const fileName = document.fileName;

        const intuitaCodeActions = this
            ._moveTopLevelNodeJobManager
            .findCodeActions(
                fileName,
                [
                    range.start.line,
                    range.start.character,
                ],
            );

        const codeActions = intuitaCodeActions
            .flatMap(
                ({
                    title,
                    oldIndex,
                    newIndex,
                    characterDifference
                }) => {
                    const fileNameHash = buildFileNameHash(
                        fileName,
                    );

                    const jobHash = buildMoveTopLevelNodeJobHash(
                        fileName,
                        oldIndex,
                        newIndex,
                    );

                    const codeAction = new vscode.CodeAction(
                        title,
                        vscode.CodeActionKind.QuickFix,
                    );

                    codeAction.command = {
                        title: 'Move',
                        command: 'intuita.moveTopLevelNode',
                        arguments: [
                            jobHash,
                            characterDifference,
                        ],
                    };

                    const showDifferenceCodeAction = new vscode.CodeAction(
                        'Show the difference (Intuita)',
                        vscode.CodeActionKind.Empty,
                    );

                    showDifferenceCodeAction.command = {
                        title: 'Diff View',
                        command: 'vscode.diff',
                        arguments: [
                            buildFileUri(fileNameHash),
                            buildJobUri(jobHash),
                        ],
                    };

                    return [
                        codeAction,
                        showDifferenceCodeAction,
                    ];
                }
            );

        return Promise.resolve(
            codeActions,
        );
	}
}
