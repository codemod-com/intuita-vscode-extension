import * as vscode from 'vscode';
import { buildTitle, MoveTopLevelNodeActionProvider } from './actionProviders/moveTopLevelNodeActionProvider';
import { moveTopLevelNodeCommands } from './commands/moveTopLevelNodeCommands';
import { getConfiguration } from './configuration';
import { buildMoveTopLevelNodeUserCommand } from './features/moveTopLevelNode/1_userCommandBuilder';
import { buildMoveTopLevelNodeFact } from './features/moveTopLevelNode/2_factBuilders';
import { calculatePosition } from './utilities';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new MoveTopLevelNodeActionProvider()
		));

	const diagnosticCollection = vscode.languages.createDiagnosticCollection('typescript');

	context.subscriptions.push(diagnosticCollection);

	const activeTextEditorChangedCallback = (
		document: vscode.TextDocument,
	) => {
		const { fileName, getText } = document;

		const fileText = getText();

		const configuration = getConfiguration();

		const userCommand = buildMoveTopLevelNodeUserCommand(
			fileName,
			fileText,
			configuration
		);

		const fact = buildMoveTopLevelNodeFact(userCommand);

		const diagnostics = fact.solutions.map(
			(solutions, index) => {
				const topLevelNode = fact.topLevelNodes[index]!;

				const solution = solutions[0]!;

				const title = buildTitle(solution, false);

				const start = calculatePosition(
					fact.separator,
					fact.lengths,
					topLevelNode.nodeStart,
				);

				const startPosition = new vscode.Position(start[0], start[1]);
				const endPosition = new vscode.Position(start[0], fact.lengths[start[0]] ?? start[1]);

				const range = new vscode.Range(
					startPosition,
					endPosition,
				);

				return new vscode.Diagnostic(
					range,
					title ?? '',
					vscode.DiagnosticSeverity.Information
				);
			}
		);

		diagnosticCollection.clear();

		diagnosticCollection.set(
			vscode.Uri.parse(fileName),
			diagnostics,
		);
	};

	if (vscode.window.activeTextEditor) {
		activeTextEditorChangedCallback(vscode.window.activeTextEditor.document);
	}

	vscode.window.onDidChangeActiveTextEditor(
		(textEditor) => {
			if (!textEditor) {
				return;
			}

			return activeTextEditorChangedCallback(textEditor.document);
		}
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.moveTopLevelNode',
			moveTopLevelNodeCommands(
				() => {
					if (vscode.window.activeTextEditor) {
						activeTextEditorChangedCallback(
							vscode
							.window
							.activeTextEditor
							.document
						);
					}
				}
			),
		),
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(
			(e) => {
				activeTextEditorChangedCallback(e.document);
			}
		),
	);

	console.log('Activated the Intuita VSCode Extension');
}

// this method is called when your extension is deactivated
export function deactivate() {}
