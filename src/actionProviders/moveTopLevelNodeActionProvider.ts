import * as vscode from 'vscode';
import { Solution } from '../features/moveTopLevelNode/2_factBuilders/solutions';
import {ExtensionStateManager} from "../features/moveTopLevelNode/extensionStateManager";

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
        coefficient,
    } = solution;

    const {
        dependencyCoefficient,
        similarityCoefficient,
        kindCoefficient,
    } = coefficient;

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

    const dependencyDriven = dependencyCoefficient > similarityCoefficient
        && dependencyCoefficient > kindCoefficient;

    const similarityDriven = similarityCoefficient > dependencyCoefficient
        && similarityCoefficient > kindCoefficient;

    const kindDriven = kindCoefficient > similarityCoefficient
        && kindCoefficient > dependencyCoefficient;

    const driveLabel = dependencyDriven
        ? '(more ordered dependencies)'
        : similarityDriven
        ? '(more name similarity)'
        : kindDriven
        ? '(more same-type blocks)'
        : '';


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

    return `Move ${nodeIdentifiersLabel} ${orderLabel} ${otherIdentifiersLabel} ${driveLabel}`;
};

export class MoveTopLevelNodeActionProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
    public constructor(
        protected _extensionStateManager: ExtensionStateManager,
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
            ._extensionStateManager
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

                    codeAction.command = {
                        title: 'Move',
                        command: 'intuita.moveTopLevelNode',
                        arguments: [
                            {
                                fileName,
                                oldIndex,
                                newIndex,
                                characterDifference
                            }
                        ]
                    };

                    const showDifferenceCodeAction = new vscode.CodeAction(
                        'Show the difference (Intuita)',
                        vscode.CodeActionKind.Empty,
                    );

                    showDifferenceCodeAction.command = {
                        title: 'Show',
                        command: 'vscode.diff',
                        arguments: [
                            document.uri,
                            vscode.Uri.parse(
                                'intuita:moveTopLevelNode'
                                + `?fileName=${encodeURIComponent(fileName)}`
                                + `&oldIndex=${String(oldIndex)}`
                                + `&newIndex=${String(newIndex)}`
                            ),
                        ]
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
