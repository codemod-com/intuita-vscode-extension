import { readFileSync } from 'node:fs';
import * as vscode from 'vscode';
import { buildMoveTopLevelNodeUserCommand } from '../features/moveTopLevelNode/1_userCommandBuilder';
import { buildMoveTopLevelNodeFact } from '../features/moveTopLevelNode/2_factBuilders';
import { Solution } from '../features/moveTopLevelNode/2_factBuilders/solutions';
import { isNeitherNullNorUndefined } from '../utilities';

const buildCodeAction = (
    fileName: string,
    solution: Solution,
): vscode.CodeAction | null => {
    const topLevelNode = solution.nodes[solution.newIndex];

    if (!topLevelNode) {
        throw new Error('error');
        return null;
    }

    const identifiers = Array.from(topLevelNode.identifiers).join(' ,');

    const {
        dependencyShare,
        similarityShare,
        kindShare,
    } = solution.coefficient;

    let reason = '';

    if (dependencyShare > similarityShare && dependencyShare > kindShare) {
        reason = 'dependencies in order';
    }

    if (similarityShare > dependencyShare && similarityShare > kindShare) {
        reason = 'more name similarity';
    }

    if (kindShare > similarityShare && kindShare > dependencyShare) {
        reason = 'blocks of the same kind closer';
    }

    const codeAction = new vscode.CodeAction(
        `Move (${identifiers}) to position ${solution.newIndex} (${reason})`,
        vscode.CodeActionKind.Refactor,
    );

    codeAction.command = {
        title: 'Move',
        command: 'intuita.moveTopLevelNode',
        arguments: [
            {
                fileName,
                oldIndex: solution.oldIndex,
                newIndex: solution.newIndex,
            }
        ]
    };

    return codeAction;
};

export class MoveTopLevelNodeActionProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
	public provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range | vscode.Selection,
	): Thenable<vscode.CodeAction[]> {
		const fileName = document.fileName;
		const fileText = readFileSync(fileName, 'utf8');
		const fileLine = range.start.line;

		const userCommand = buildMoveTopLevelNodeUserCommand(
			fileName,
			fileText,
			fileLine,
			{
				dependencyCoefficientWeight: 1,
				similarityCoefficientWeight: 1,
				kindCoefficientWeight: 1,
			},
		);

		const fact = buildMoveTopLevelNodeFact(userCommand);

        const codeActions = fact
            .solutions
            .map(
                (solution) => buildCodeAction(
                    fileName,
                    solution,
                )
            )
            .filter(isNeitherNullNorUndefined);

        return Promise.resolve(codeActions);
	}
}
