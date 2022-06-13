import * as child_process from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { join } from 'path';
import { stringify } from 'querystring';
import { promisify } from 'util';
import * as vscode from 'vscode';
import * as ts from 'typescript';
import * as oh from 'object-hash'

const exec = promisify(child_process.exec)
const mkdir = promisify(fs.mkdir)

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

const getTimestamp = (): number => {
	return Date.now() / 1000;
}

const getDirectoryLastModificationTimestamp = async (path: string): Promise<number | null> => {
	try {
		const outputs = await exec(
			'find "$INTUITA_PATH" -type f -printf "%T@+\n" | sort -nr | head -n 1',
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

const getFileLastModificationTimestamp = async (path: string): Promise<number | null> => {
	try {
		const outputs = await exec(
			'stat "$INTUITA_PATH" --printf "%Y\n"',
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

const cpgParseWorkspace = async (
	storageUri: vscode.Uri,
	workspaceFolder: vscode.WorkspaceFolder,
) => {
	const workspacePath = encodeURI(workspaceFolder.uri.fsPath);
	const workspacePathHash = buildHash(workspacePath);

	const timestamp = (await getDirectoryLastModificationTimestamp(workspacePath)) ?? getTimestamp();
	
	const cpgDirectoryPath = join(
		storageUri.fsPath,
		workspacePathHash,
		String(timestamp),
	)

	const cpgFilePath = join(
		cpgDirectoryPath,
		'cpg.bin',
	);

	console.log('A', cpgDirectoryPath);

	try {
		await mkdir(cpgDirectoryPath, { recursive: true })
	} catch (error) {
		console.error(error);
	}
	

	const cpgLastModificationTimestamp = await getFileLastModificationTimestamp(cpgFilePath);

	console.log(cpgLastModificationTimestamp);
	console.log(timestamp);
	
	if (cpgLastModificationTimestamp && cpgLastModificationTimestamp >= timestamp) {
		console.log('No new CPG will be created.')

		return;
	}

	const cpgOutputs = await exec(
		'joern-parse --output="$JOERN_PROXY_OUTPUT" "$JOERN_PROXY_INPUT"',
		{
			env: {
				JOERN_PROXY_INPUT: workspacePath,
				JOERN_PROXY_OUTPUT: cpgFilePath,
				PATH: process.env.PATH,
			}
		}
	)

	console.log(cpgOutputs)
}

type X = Readonly<{
	nodes: ReadonlyArray<ts.Node>,
	hashes: ReadonlyArray<string>,
}>;
	

export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated the Intuita VSCode Extension')

	const { storageUri } = context;

	if (!storageUri) {
		return;
	}

	// for(const workspaceFolder of vscode.workspace.workspaceFolders ?? []) {
	// 	await cpgParseWorkspace(storageUri, workspaceFolder)
	// }

	const openedTextDocuments = new Map<string, string>();
	const changedTextDocuments = new Map<string, string>();

	vscode.workspace.onDidOpenTextDocument(
		({ fileName, getText }) => {
			const text = getText();

			openedTextDocuments.set(fileName, text)
			changedTextDocuments.set(fileName, text);
		}
	)

	vscode.workspace.onDidCloseTextDocument(
		({ fileName }) => {
			openedTextDocuments.delete(fileName);
			changedTextDocuments.delete(fileName);
		}
	)

	vscode.workspace.onDidChangeTextDocument(
		({ document })=> {
			const newText = document.getText();

			changedTextDocuments.set(
				document.fileName,
				newText,
			)

			// TODO
			const sourceFile = ts.createSourceFile(
				document.fileName,
				newText,
				ts.ScriptTarget.Latest,
			)

			const nodes: ts.Node[] = [];
			
			const callback = (node: ts.Node) => {
				nodes.push(node);

				ts.forEachChild(
					node,
					(childNode) => {
						callback(childNode);
					}
				)
			}

			callback(sourceFile);

			const hashes = nodes.map(node => oh(node))

			console.log(x);

			return nodes;
		}
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
