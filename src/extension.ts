import { join } from 'path';
import * as vscode from 'vscode';
import { getAstChanges } from './getAstChanges';
import { AstChangeApplier } from "./getAstChangedSourceFileText";
import { Project } from "ts-morph";
import { watchProject } from './watchedProject';

export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated the Intuita VSCode Extension')

	const { storageUri } = context;

	if (!storageUri) {
		return;
	}

	const openedTextDocuments = new Map<string, string>();
	const changedTextDocuments = new Map<string, string>();
	const projects: Project[] = [];

	vscode.workspace.workspaceFolders?.forEach(
		(workspaceFolder) => {
			const { fsPath } = workspaceFolder.uri;

			const project = new Project({
				tsConfigFilePath: join(
					fsPath,
					'tsconfig.json'
				),
			})

			watchProject(project);

			projects.push(project);
		}
	)

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

	let react = true;

	vscode.workspace.onDidSaveTextDocument(
		(document)=> {
			if (!react) {
				return;
			}

			react = false;

			setTimeout(
				() => {
					react = true;
				},
				10000,
			)

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

			const project = projects.find(
				(_project) => _project.getSourceFile(fileName) !== undefined,
			)

			if (!project) {
				console.log('did not find a project')
				return;
			}
			
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
