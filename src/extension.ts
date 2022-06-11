import * as child_process from 'child_process';
import * as crypto from 'crypto';
import { promisify } from 'util';
import * as vscode from 'vscode';

const exec = promisify(child_process.exec)

const buildHash = (str: string): string => {
	return crypto.createHash('ripemd160')
		.update(str)
		.digest('base64url');
}

const parseInteger = (str: string): number | null => {
	const timestamp = parseInt(str, 10);

	if (Number.isNaN(timestamp)) {
		return null;
	}

	return timestamp;
}

const getDirectoryLastModificationTimestamp = async (path: string): Promise<number | null> => {
	try {
		const outputs = await exec(
			'find $INTUITA_PATH -type f -printf "%T@+\n" | sort -nr | head -n 1',
			{
				env: {
					INTUITA_PATH: path
				}
			}
		)

		return parseInteger(outputs.stdout);
	} catch (error) {
		console.error(error);

		return null;
	}
}

const getFileLastModificationTimestamp = async (path: string) => {
	try {
		const outputs = await exec(
			'stat $INTUITA_PATH --printf "%Y\n"',
			{
				env: {
					INTUITA_PATH: path
				}
			}
		)

		return parseInteger(outputs.stdout);
	} catch (error) {
		console.error(error);

		return null;
	}
}

const cpgParseWorkspace = async (workspaceFolder: vscode.WorkspaceFolder) => {
	const { fsPath } = workspaceFolder.uri;

	const timestamp = await getDirectoryLastModificationTimestamp(fsPath)

	console.log(timestamp);
	
}
	

export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated the Intuita VSCode Extension')

	for(const workspaceFolder of vscode.workspace.workspaceFolders ?? []) {
		await cpgParseWorkspace(workspaceFolder)
	}

	// vscode.workspace.

	console.log('STORAGEURI', context.storageUri)

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
