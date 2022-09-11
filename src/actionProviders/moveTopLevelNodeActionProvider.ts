import * as vscode from 'vscode';
import { Solution } from '../features/moveTopLevelNode/2_factBuilders/solutions';
import {MoveTopLevelNodeJobManager} from "../features/moveTopLevelNode/moveTopLevelNodeJobManager";
import { buildFileNameHash } from '../features/moveTopLevelNode/fileNameHash';
import { buildMoveTopLevelNodeJobHash } from '../features/moveTopLevelNode/jobHash';
import { buildFileUri, buildJobUri } from '../fileSystems/uris';

const buildIdentifiersLabel = (
    identifiers: ReadonlyArray<string>,
    useHtml: boolean,
): string => {
    const label = identifiers.length > 1
        ? `(${identifiers.join(' ,')})`
        : identifiers.join('');

    if (useHtml === false) {
        return label;
    }

    return `<b>${label}</b>`;
};

export const buildTitle = (
    solution: Solution,
    useHtml: boolean,
): string | null => {
    const {
        nodes,
        newIndex,
    } = solution;

    const node = nodes[newIndex];

    if (!node) {
        return null;
    }

    let nodeIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            node.identifiers
        ),
        useHtml,
    );

    const otherNode = newIndex === 0
        ? nodes[1]
        : nodes[newIndex - 1];

    if (!otherNode) {
        return null;
    }

    const orderLabel = newIndex === 0
        ? 'before'
        : 'after';

    const otherIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            otherNode.identifiers
        ),
        useHtml,
    );

    return `Move ${nodeIdentifiersLabel} ${orderLabel} ${otherIdentifiersLabel}`;
};

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

		const fileLine = range.start.line;
        const fileCharacter = range.start.character;

        const intuitaCodeActions = this
            ._moveTopLevelNodeJobManager
            .findCodeActions(
                fileName,
                [
                    fileLine,
                    fileCharacter,
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
                    const codeAction = new vscode.CodeAction(
                        title,
                        vscode.CodeActionKind.QuickFix,
                    );

                    const fileNameHash = buildFileNameHash(
                        fileName,
                    );

                    const jobHash = buildMoveTopLevelNodeJobHash(
                        fileName,
                        oldIndex,
                        newIndex,
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
