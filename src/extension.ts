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
	)

	console.log('Activated the Intuita VSCode Extension')
}

// this method is called when your extension is deactivated
export function deactivate() {}
