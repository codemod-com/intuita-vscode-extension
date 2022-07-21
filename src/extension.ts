import * as vscode from 'vscode';
import { buildTitle, MoveTopLevelNodeActionProvider } from './actionProviders/moveTopLevelNodeActionProvider';
import { moveTopLevelNodeCommands } from './commands/moveTopLevelNodeCommands';
import { getConfiguration } from './configuration';
import {
	MoveTopLevelNodeUserCommand
} from './features/moveTopLevelNode/1_userCommandBuilder';
import { buildMoveTopLevelNodeFact } from './features/moveTopLevelNode/2_factBuilders';
import { calculatePosition } from './utilities';
import {ExtensionStateManager} from "./features/moveTopLevelNode/extensionStateManager";

export async function activate(context: vscode.ExtensionContext) {
	const configuration = getConfiguration();

	const extensionStateManager = new ExtensionStateManager(
		configuration,
	);

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

		const diagnostics = extensionStateManager
			.onFileTextChanged(
				fileName,
				fileText,
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
