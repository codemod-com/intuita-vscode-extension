import * as vscode from 'vscode';
import { getConfiguration } from '../configuration';
import { Solution } from '../features/moveTopLevelNode/2_factBuilders/solutions';
import { buildFact } from '../features/moveTopLevelNode/builder';

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
        similarityStructure,
        kindStructure,
    } = coefficient;

    const node = solution.nodes[newIndex];

    if (!node) {
        return null;
    }

    let nodeIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            node.identifiers
        ),
        useHtml,
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
            ),
            useHtml,
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
                ),
                useHtml,
            );

            return `Move ${nodeIdentifiersLabel} after ${label} (more name similarity)`;
        } else {
            const otherIdentifiers = solution.nodes[newIndex + 1]?.identifiers ?? new Set();

            const label = buildIdentifiersLabel(
                Array.from(
                    otherIdentifiers
                ),
                useHtml,
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
                ),
                useHtml,
            );

            return `Move ${nodeIdentifiersLabel} after ${label} (more same-type blocks)`;
        } else {
            const otherIdentifiers = solution.nodes[newIndex + 1]?.identifiers ?? new Set();

            const label = buildIdentifiersLabel(
                Array.from(
                    otherIdentifiers
                ),
                useHtml,
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

    const title = buildTitle(
        solution,
        false,
    );

    if (title === null) {
        return null;
    }

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

        const configuration = getConfiguration();

        const fact = buildFact(
            fileName,
            fileText,
            [fileLine, fileCharacter],
            configuration,
        );

        if (fact === null) {
            return Promise.resolve([]);
        }

        const codeAction = buildCodeAction(
            fileName,
            fact.characterDifference,
            fact.solution,
        );

        if (codeAction === null) {
            return Promise.resolve([]);
        }

        return Promise.resolve([
            codeAction,
        ]);
	}
}
