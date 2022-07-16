import * as vscode from 'vscode';
import { getConfiguration } from '../configuration';
import { buildMoveTopLevelNodeUserCommand } from '../features/moveTopLevelNode/1_userCommandBuilder';
import { buildMoveTopLevelNodeFact } from '../features/moveTopLevelNode/2_factBuilders';
import { Solution } from '../features/moveTopLevelNode/2_factBuilders/solutions';
import {isNeitherNullNorUndefined} from '../utilities';

const buildIdentifiersLabel = (
    identifiers: ReadonlyArray<string>
): string => {
    return identifiers.length > 1
        ? `(${identifiers.join(' ,')})`
        : identifiers.join('');
};

export const buildTitle = (
    solution: Solution,
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
        similarityStructure,
        kindStructure,
    } = coefficient;

    const node = solution.nodes[newIndex];

    if (!node) {
        return null;
    }

    const nodeIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            node.identifiers
        )
    );

    if (dependencyCoefficient > similarityCoefficient && dependencyCoefficient > kindCoefficient) {
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
            )
        );

        return `Move ${nodeIdentifiersLabel} ${orderLabel} ${otherIdentifiersLabel} (more ordered dependencies)`;
    }

    if (similarityCoefficient > dependencyCoefficient && similarityCoefficient > kindCoefficient) {
        const previous = similarityStructure?.previousNodeCoefficient ?? 1;
        const next     = similarityStructure?.nextNodeCoefficient ?? 1;

        if (previous < next) {
            const otherIdentifiers = solution.nodes[newIndex - 1]?.identifiers ?? new Set();

            const label = buildIdentifiersLabel(
                Array.from(
                    otherIdentifiers
                )
            );

            return `Move ${nodeIdentifiersLabel} after ${label} (more name similarity)`;
        } else {
            const otherIdentifiers = solution.nodes[newIndex + 1]?.identifiers ?? new Set();

            const label = buildIdentifiersLabel(
                Array.from(
                    otherIdentifiers
                )
            );

            return `Move ${nodeIdentifiersLabel} before ${label} (more name similarity)`;
        }
    }

    if (kindCoefficient > similarityCoefficient && kindCoefficient > dependencyCoefficient) {
        const previous = kindStructure?.previousNodeCoefficient ?? 1;
        const next     = kindStructure?.nextNodeCoefficient ?? 1;

        if (previous < next) {
            const otherIdentifiers = solution.nodes[newIndex - 1]?.identifiers ?? new Set();

            const label = buildIdentifiersLabel(
                Array.from(
                    otherIdentifiers
                )
            );

            return `Move ${nodeIdentifiersLabel} after ${label} (more same-type blocks)`;
        } else {
            const otherIdentifiers = solution.nodes[newIndex + 1]?.identifiers ?? new Set();

            const label = buildIdentifiersLabel(
                Array.from(
                    otherIdentifiers
                )
            );

            return `Move ${nodeIdentifiersLabel} before ${label} (more same-type blocks)`;
        }
    }

    return null;
};

const buildCodeAction = (
    fileName: string,
    characterDifference: number,
    solution: Solution,
): vscode.CodeAction | null => {
    const { oldIndex, newIndex, nodes } = solution;

    const otherNode = newIndex === 0
        ? nodes[1]
        : nodes[newIndex - 1];

    const node = solution.nodes[newIndex];

    if (!node || !otherNode) {
        return null;
    }

    const title = buildTitle(solution);

    if (title === null) {
        return null;
    }

    const codeAction = new vscode.CodeAction(
        title,
        vscode.CodeActionKind.Refactor,
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

    return codeAction;
};

export class MoveTopLevelNodeActionProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
	public provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range | vscode.Selection,
	): Thenable<vscode.CodeAction[]> {
		const fileName = document.fileName;
		const fileText = document.getText();
		const fileLine = range.start.line;
        const fileCharacter = range.start.character;

        const configuration = getConfiguration()

		const userCommand = buildMoveTopLevelNodeUserCommand(
			fileName,
			fileText,
			fileLine,
            fileCharacter,
			{
				...configuration,
			},
		);

		const fact = buildMoveTopLevelNodeFact(userCommand);

        const codeActions = fact
            .solutions
            .filter(
                (solution) => {
                    return solution.newIndex !== solution.oldIndex;
                }
            )
            .slice(0, 1)
            .map(
                (solution) => buildCodeAction(
                    fileName,
                    fact.characterDifference,
                    solution,
                )
            )
            .filter(isNeitherNullNorUndefined);

        return Promise.resolve(codeActions);
	}
}
