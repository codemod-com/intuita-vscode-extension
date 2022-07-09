import * as vscode from 'vscode';
// import { getAstChanges } from './getAstChanges';
// import { AstChangeApplier } from "./astChangeApplier";
// import { Project } from "ts-morph";
// import { watchProject } from './watchedProject';
import {readFileSync, writeFileSync} from "fs";
// import {reorderDeclarations} from "./features/reorderDeclarations";
// import {join} from "path";
import {CodeAction, CodeActionKind} from "vscode";
import {buildMoveTopLevelNodeUserCommand} from "./features/moveTopLevelNode/1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./features/moveTopLevelNode/2_factBuilders/2_factBuilder";
import {buildMoveTopLevelNodeAstCommand} from "./features/moveTopLevelNode/3_astCommandBuilder";
import {moveTopLevelNode} from "./features/moveTopLevelNode";

class MoveTopLevelNodeActionProvider implements vscode.CodeActionProvider<vscode.CodeAction> {
	public provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range | vscode.Selection,
	): Thenable<vscode.CodeAction[]> {
		const fileName = document.fileName;
		const fileText = readFileSync(fileName, 'utf8');
		const fileLine = range.start.line;

		const userCommand = buildMoveTopLevelNodeUserCommand(
			fileName,
			fileText,
			fileLine,
			{
				dependencyCoefficientWeight: 1,
				similarityCoefficientWeight: 1,
				kindCoefficientWeight: 1,
			},
		);

		const fact = buildMoveTopLevelNodeFact(userCommand);

		const { selectedTopLevelNodeIndex, topLevelNodes } = fact;

		const topLevelNode = topLevelNodes[selectedTopLevelNodeIndex] ?? null;

		if (topLevelNode === null) {
			return Promise.resolve([]);
		}

		const astCommand = buildMoveTopLevelNodeAstCommand(
			userCommand,
			fact,
		);

		if (astCommand === null || astCommand.oldIndex === astCommand.newIndex) {
			return Promise.resolve([]);
		}

		const identifiers = Array.from(topLevelNode.identifiers).join(' ,');

		const {
			dependencyShare,
			similarityShare,
			kindShare,
		} = astCommand.coefficient;

		let reason = '';

		if (dependencyShare > similarityShare && dependencyShare > kindShare) {
			reason = 'dependencies in order';
		}

		if (similarityShare > dependencyShare && similarityShare > kindShare) {
			reason = 'more name similarity';
		}

		if (kindShare > similarityShare && kindShare > dependencyShare) {
			reason = 'blocks of the same kind closer';
		}

		const codeAction = new CodeAction(
			`Move (${identifiers}) to position ${astCommand.newIndex} (${reason})`,
			CodeActionKind.Refactor,
		);

		codeAction.command = {
			title: 'Move',
			command: 'intuita.moveTopLevelNode',
			arguments: [
				{
					fileName,
					fileLine,
				}
			]
		};

		return Promise.resolve([
			codeAction,
		]);
	}
}

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new MoveTopLevelNodeActionProvider()
		));

	vscode.commands.registerCommand(
		'intuita.moveTopLevelNode',
		(args) => {
			const fileName: string | null = args && typeof args.fileName === 'string'
				? args.fileName
				: null;

			const fileLine: number | null = args && typeof args.fileLine === 'number'
				? args.fileLine
				: null;

			if (fileName === null || fileLine === null) {
				return;
			}

			const fileText = readFileSync(fileName, 'utf8');

			const executions = moveTopLevelNode(
				fileName,
				fileText,
				fileLine,
				{
					dependencyCoefficientWeight: 1,
					similarityCoefficientWeight: 1,
					kindCoefficientWeight: 1,
				},
			);

			for (const { name, text } of executions) {
				writeFileSync(name, text);
			}
		}
	);

	// vscode.commands.registerCommand(
	// 	'intuita.reorderDeclarations',
	// 	(args) => {
	// 		const fileName: string | null = args && typeof args.fileName === 'string'
	// 			? args.fileName
	// 			: null;
	//
	// 		if (fileName === null) {
	// 			return;
	// 		}
	//
	// 		const fileText = readFileSync(fileName, 'utf8');
	//
	// 		const executions = reorderDeclarations(fileName, fileText);
	//
	// 		for (const { name, text } of executions) {
	// 			writeFileSync(name, text);
	// 		}
	// 	}
	// );

	// vscode.languages.registerHoverProvider(
	// 	'typescript',
	// 	{
	// 		provideHover(
	// 			document: vscode.TextDocument,
	// 		) {
	// 			const args = { fileName: document.uri.path };
	// 			const encodedArgs = encodeURIComponent(JSON.stringify(args));
	// 			const value = `command:intuita.reorderDeclarations?${encodedArgs}`;
	//
	// 			const stageCommandUri = vscode.Uri.parse(value);
	//
	// 			const contents = new vscode.MarkdownString(
	// 				`[Intuita: Reorder Declarations](${stageCommandUri})`
	// 			);
	// 			contents.isTrusted = true;
	//
	// 			return new vscode.Hover(contents);
	// 		}
	// 	},
	// );

	console.log('Activated the Intuita VSCode Extension')

	// const { storageUri } = context;
	//
	// if (!storageUri) {
	// 	return;
	// }
	//
	// const openedTextDocuments = new Map<string, string>();
	// const changedTextDocuments = new Map<string, string>();
	// const projects: Project[] = [];
	//
	// vscode.workspace.workspaceFolders?.forEach(
	// 	(workspaceFolder) => {
	// 		const { fsPath } = workspaceFolder.uri;
	//
	// 		console.log({ fsPath });
	//
	// 		const project = new Project({
	// 			tsConfigFilePath: join(
	// 				fsPath,
	// 				'tsconfig.json'
	// 			),
	// 		})
	//
	// 		console.log(project.getSourceFiles().map(sf => sf.getFilePath()));
	//
	// 		watchProject(project);
	//
	// 		projects.push(project);
	// 	}
	// )
	//
	// vscode.window.showInformationMessage(
	// 	`Loaded TS-Morph projects for all workspace folders.`
	// );
	//
	// const addTextDocument = (textDocument: vscode.TextDocument) => {
	// 	const fileName = textDocument.fileName.replace('.git', '');
	//
	// 	console.log(`The document "${fileName}" has been opened.`);
	//
	// 	const text = textDocument.getText();
	//
	// 	openedTextDocuments.set(fileName, text)
	// 	changedTextDocuments.set(fileName, text);
	// }
	//
	// vscode.workspace.textDocuments.map(
	// 	addTextDocument,
	// )
	//
	// vscode.workspace.onDidOpenTextDocument(
	// 	addTextDocument,
	// )
	//
	// vscode.workspace.onDidCloseTextDocument(
	// 	({ fileName }) => {
	// 		console.log(`The document "${fileName}" has been closed.`);
	//
	// 		openedTextDocuments.delete(fileName);
	// 		changedTextDocuments.delete(fileName);
	// 	}
	// )
	//
	// const mutexifyCallback = (
	// 	callback: (textDocument: vscode.TextDocument) => void,
	// ) => (textDocument: vscode.TextDocument) => {
	// 	let allow = true;
	//
	// 	try {
	// 		if (!allow) {
	// 			console.log('Cannot allow the incoming event in');
	// 			return;
	// 		}
	//
	// 		allow = false;
	//
	// 		callback(textDocument);
	// 	} catch (error) {
	// 		console.error(error);
	// 	} finally {
	// 		allow = true;
	// 	}
	// }
	//
	// vscode.workspace.onDidSaveTextDocument(
	// 	mutexifyCallback(
	// 		(document) => {
	// 			const { fileName } = document;
	//
	// 			console.log(`The document "${fileName}" has been saved.`);
	//
	// 			const newText = document.getText();
	//
	// 			changedTextDocuments.set(
	// 				fileName,
	// 				newText,
	// 			);
	//
	// 			const oldText = openedTextDocuments.get(fileName);
	//
	// 			if (!oldText) {
	// 				console.log(`No text for "${fileName}" could have been extracted.`);
	// 				return;
	// 			}
	//
	// 			const astChanges = getAstChanges(
	// 				fileName,
	// 				oldText,
	// 				newText,
	// 			);
	//
	// 			if (!astChanges) {
	// 				console.log(`No AST changes for ${fileName} have been recognized.`)
	// 				return;
	// 			}
	//
	// 			const project = projects.find(
	// 				(_project) => _project.getSourceFile(fileName) !== undefined,
	// 			)
	//
	// 			if (!project) {
	// 				console.log(`Did not find a project for the file name ${fileName}`)
	// 				return;
	// 			}
	//
	// 			const astChangeApplier = new AstChangeApplier(
	// 				project,
	// 				astChanges,
	// 			)
	//
	// 			vscode.window.showInformationMessage(
	// 				`Applying ${astChanges.length} AST changes in file(s).`
	// 			);
	//
	// 			const changes = astChangeApplier.applyChanges()
	//
	// 			if (changes.length) {
	// 				vscode.window.showInformationMessage(
	// 					`Applied changes in ${changes.length} file(s).`
	// 				);
	// 			}
	//
	// 			vscode.commands.executeCommand('workbench.view.scm')
	// 		}
	// 	)
	// )
}

// this method is called when your extension is deactivated
export function deactivate() {}
