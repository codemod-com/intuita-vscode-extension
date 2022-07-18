import * as vscode from 'vscode';
import { MoveTopLevelNodeActionProvider } from './actionProviders/moveTopLevelNodeActionProvider';
import { moveTopLevelNodeCommands } from './commands/moveTopLevelNodeCommands';
import { moveTopLevelNodeHoverProvider } from './hoverProviders/moveTopLevelNodeHoverProvider';

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
		const { fileName } = textEditor.document;

		const diagnostics = [
			new vscode.Diagnostic(
				new vscode.Range(2, 0, 2, 65),
				'Move top-level node',
				vscode.DiagnosticSeverity.Information
			)
		];

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
