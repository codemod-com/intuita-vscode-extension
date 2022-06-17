import { join } from 'path';
import * as vscode from 'vscode';
import { getAstChanges } from './getAstChanges';
import {AstChangeApplier} from "./getAstChangedSourceFileText";
import {Project} from "ts-morph";

export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated the Intuita VSCode Extension')

	const { storageUri } = context;

	if (!storageUri) {
		return;
	}

	const openedTextDocuments = new Map<string, string>();
	const changedTextDocuments = new Map<string, string>();

	vscode.workspace.onDidOpenTextDocument(
		(document) => {
			const fileName = document.fileName.replace('.git', '');

			console.log(`The document "${fileName}" has been opened.`);

			const text = document.getText();

			openedTextDocuments.set(fileName, text)
			changedTextDocuments.set(fileName, text);
		}
	)

	vscode.workspace.onDidCloseTextDocument(
		({ fileName }) => {
			console.log(`The document "${fileName}" has been closed.`);

			openedTextDocuments.delete(fileName);
			changedTextDocuments.delete(fileName);
		}
	)

	vscode.workspace.onDidSaveTextDocument(
		(document)=> {
			const { fileName } = document;

			console.log(`The document "${fileName}" has been saved.`);

			const newText = document.getText();

			changedTextDocuments.set(
				fileName,
				newText,
			);

			const oldText = openedTextDocuments.get(fileName);

			if (!oldText) {
				console.log(`No text for "${fileName}" could have been extracted.`);
				return;
			}

			const astChanges = getAstChanges(
				fileName,
				oldText,
				newText,
			);

			if (!astChanges) {
				console.log(`No AST changes for ${fileName} have been recognized.`)
				return;
			}

			const project = new Project({
				tsConfigFilePath: join(
					vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '',
					'tsconfig.json'
				),
			})
			
			const astChangeApplier = new AstChangeApplier(
				project,
				astChanges,
			)

			const changes = astChangeApplier.applyChanges()

			if (changes.length) {
				vscode.window.showInformationMessage(
					`Applied changes in ${changes.length} file(s).`
				);
			}
		}
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
