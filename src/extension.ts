import * as child_process from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';

const exec = promisify(child_process.exec)

const getLastModificationTimestamp = async (path: string): Promise<number | null> => {
	try {
		const outputs = await exec(
			'find $INTUITA_PATH -type f -printf "%T@+\n" | sort -nr | head -n 1',
			{
				env: {
					INTUITA_PATH: path
				}
			}
		)
	
		const stringifiedTimestamp = outputs.stdout.split('.')?.[0];

		if (!stringifiedTimestamp) {
			return null;
		}

		const timestamp = parseInt(stringifiedTimestamp, 10);

		if (Number.isNaN(timestamp)) {
			return null;
		}

		return timestamp;
	} catch (error) {
		console.error(error);

		return null;
	}
}

const cpgParseWorkspace = async (workspaceFolder: vscode.WorkspaceFolder) => {
	const { fsPath } = workspaceFolder.uri;

	const timestamp = await getLastModificationTimestamp(fsPath)

	console.log(timestamp);
	
}
	

export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated the Intuita VSCode Extension')

	for(const workspaceFolder of vscode.workspace.workspaceFolders ?? []) {
		cpgParseWorkspace(workspaceFolder)
	}

	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
	const uri = workspaceFolder?.uri

	// vscode.workspace.

	console.log('STORAGEURI', context.storageUri)

	console.log(uri);

	// context

	

	// let disposableOpl = vscode.commands.registerCommand('intuita-vscode-extension.objectifyParameterList', () => {
	// 	const str = child_process.execSync('./dist/a.out').toString('utf8')

	// 	console.log(str);

	// 	// const str = child_process.execSync('pwd').toString('utf8')

	// 	// // vscode.window.showInformationMessage(`HERE: ${str}`);
		// 

	// 	// const uri = workspaceFolder?.uri

	// 	// if (uri) {
	// 	// 	const x = vscode.workspace.fs.readDirectory(uri).then(
	// 	// 		(c) => {
	// 	// 			for(const ci of c) {
	// 	// 				console.log(ci);
	// 	// 			}
	// 	// 		}
	// 	// 	)
	// 	// }
	
	// });

	// context.subscriptions.push(disposableOpl);
}

// this method is called when your extension is deactivated
export function deactivate() {}
