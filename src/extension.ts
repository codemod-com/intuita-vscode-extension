import * as vscode from 'vscode';
import { readFileSync } from "fs";
import { buildTopLevelNodes } from './features/moveTopLevelNode/2_factBuilders/buildTopLevelNodes';
import { getStringNodes } from './features/moveTopLevelNode/2_factBuilders/stringNodes';
import { executeMoveTopLevelNodeAstCommand } from './features/moveTopLevelNode/4_astCommandExecutor';
import { MoveTopLevelNodeActionProvider } from './actionProviders/moveTopLevelNodeActionProvider';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new MoveTopLevelNodeActionProvider()
		));

	vscode.commands.registerCommand(
		'intuita.moveTopLevelNode',
		async (args) => {
			const fileName: string | null = args && typeof args.fileName === 'string'
				? args.fileName
				: null;

			const oldIndex: number | null = args && typeof args.oldIndex === 'number'
				? args.oldIndex
				: null;

			const newIndex: number | null = args && typeof args.newIndex === 'number'
				? args.newIndex
				: null;

			if (fileName === null || oldIndex === null || newIndex === null) {
				return;
			}

			const fileText = readFileSync(fileName, 'utf8');

			const topLevelNodes = buildTopLevelNodes(
				fileName,
				fileText,
			);

			const stringNodes = getStringNodes(fileText, topLevelNodes);

			const executions = executeMoveTopLevelNodeAstCommand({
				kind: "MOVE_TOP_LEVEL_NODE",
				fileName,
				oldIndex,
				newIndex,
				stringNodes,
			});

			for (const { name, text, lineNumber } of executions) {
				if (vscode.window.activeTextEditor) {
					const oldText = vscode.window.activeTextEditor.document.getText();
					const oldLines = oldText.split('\n');
					const oldTextLastLineNumber = oldLines.length - 1;
					const oldTextLastCharacter = oldLines[oldLines.length - 1]?.length ?? 0;

					await vscode.window.activeTextEditor.edit(
						(textEditorEdit) => {
							textEditorEdit.replace(
								new vscode.Range(
									new vscode.Position(
										0,
										0
									),
									new vscode.Position(
										oldTextLastLineNumber,
										oldTextLastCharacter
									),
								),
								text,
							);
						}
					);

					const position = new vscode.Position(lineNumber, 0);
					const selection = new vscode.Selection(position, position);
					
					vscode.window.activeTextEditor.selections = [ selection ];
				}
			}
		}
	);

	console.log('Activated the Intuita VSCode Extension')
}

// this method is called when your extension is deactivated
export function deactivate() {}
