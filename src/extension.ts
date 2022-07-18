import * as vscode from 'vscode';
import { buildTitle, MoveTopLevelNodeActionProvider } from './actionProviders/moveTopLevelNodeActionProvider';
import { moveTopLevelNodeCommands } from './commands/moveTopLevelNodeCommands';
import { getConfiguration } from './configuration';
import { buildMoveTopLevelNodeUserCommand } from './features/moveTopLevelNode/1_userCommandBuilder';
import { buildMoveTopLevelNodeFact } from './features/moveTopLevelNode/2_factBuilders';
import { moveTopLevelNodeHoverProvider } from './hoverProviders/moveTopLevelNodeHoverProvider';
import { calculatePosition } from './utilities';

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new MoveTopLevelNodeActionProvider()
		));

	vscode.commands.registerCommand(
		'intuita.moveTopLevelNode',
		moveTopLevelNodeCommands,
	);

	vscode.languages.registerHoverProvider(
		'typescript',
		moveTopLevelNodeHoverProvider,
	);

	const diagnosticCollection = vscode.languages.createDiagnosticCollection('typescript');

	context.subscriptions.push(diagnosticCollection);

	const activeTextEditorChangedCallback = (
		textEditor: vscode.TextEditor,
	) => {
		const { fileName, getText } = textEditor.document;

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
					topLevelNode.start,
				);
		
				const end = calculatePosition(
					fact.separator,
					fact.lengths,
					topLevelNode.end,
				);
		
				const startPosition = new vscode.Position(start[0], start[1]);
				const endPosition = new vscode.Position(end[0], end[1]);
		
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

		diagnosticCollection.set(
			vscode.Uri.parse(fileName),
			diagnostics,
		);
	};

	if (vscode.window.activeTextEditor) {
		activeTextEditorChangedCallback(vscode.window.activeTextEditor);
	}

	vscode.window.onDidChangeActiveTextEditor(
		(textEditor) => {
			if (!textEditor) {
				return;
			}

			return activeTextEditorChangedCallback(textEditor);
		}
	);

	console.log('Activated the Intuita VSCode Extension');
}

// this method is called when your extension is deactivated
export function deactivate() {}
