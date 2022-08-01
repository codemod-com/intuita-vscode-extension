import * as vscode from 'vscode';
import { MoveTopLevelNodeActionProvider } from './actionProviders/moveTopLevelNodeActionProvider';
import { getConfiguration } from './configuration';
import {ExtensionStateManager, IntuitaDiagnostic} from "./features/moveTopLevelNode/extensionStateManager";
import {Diagnostic, DiagnosticSeverity, Position, Range} from "vscode";
import { IntuitaRange} from "./utilities";

export async function activate(
	context: vscode.ExtensionContext,
) {
	const configuration = getConfiguration();

	const diagnosticCollection = vscode
		.languages
		.createDiagnosticCollection(
			'typescript'
		);

	const _setDiagnosticEntry = (
		fileName: string,
		intuitaDiagnostics: ReadonlyArray<IntuitaDiagnostic>
	) => {
		const diagnostics = intuitaDiagnostics
			.map(
				({ title, range: intuitaRange }) => {
					const startPosition = new Position(
						intuitaRange[0],
						intuitaRange[1],
					);

					const endPosition = new Position(
						intuitaRange[2],
						intuitaRange[3],
					);

					const range = new Range(
						startPosition,
						endPosition,
					);

					return new Diagnostic(
						range,
						title,
						DiagnosticSeverity.Information
					);
				}
			);

		diagnosticCollection.clear();

		diagnosticCollection.set(
			vscode.Uri.parse(fileName),
			diagnostics,
		);
	};

	const extensionStateManager = new ExtensionStateManager(
		configuration,
		_setDiagnosticEntry,
	);

	const textDocumentContentProvider: vscode.TextDocumentContentProvider = {
		provideTextDocumentContent(
			uri: vscode.Uri
		): string {
			uri.toJSON();

			return '';
		}
	};

	context.subscriptions.push(
		vscode.workspace.registerTextDocumentContentProvider(
			'intuita',
			textDocumentContentProvider
		)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new MoveTopLevelNodeActionProvider(
				extensionStateManager,
			)
		));


	const activeTextEditorChangedCallback = (
		document: vscode.TextDocument,
		characterRanges: ReadonlyArray<IntuitaRange>,
	) => {
		extensionStateManager
			.onFileTextChanged(
				document,
				characterRanges,
			);
	};

	if (vscode.window.activeTextEditor) {
		activeTextEditorChangedCallback(
			vscode
				.window
				.activeTextEditor
				.document,
			[],
		);
	}

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(
			(textEditor) => {
				if (!textEditor) {
					return;
				}

				return activeTextEditorChangedCallback(
					textEditor
						.document,
					[],
				);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.moveTopLevelNode',
			async (args) => {
				const fileName: string | null = args && typeof args.fileName === 'string'
					? args.fileName
					: null;

				const oldIndex: number | null = args && typeof args.oldIndex === 'number'
					? args.oldIndex
					: null;

				const newIndex: number | null = args && typeof args.newIndex === 'number'
					? args.newIndex
					: null;

				const characterDifference: number | null = args && typeof args.characterDifference === 'number'
					? args.characterDifference
					: null;

				const activeTextEditor = vscode.window.activeTextEditor ?? null;

				if (
					fileName === null
					|| oldIndex === null
					|| newIndex === null
					|| characterDifference === null
					|| activeTextEditor === null
					|| activeTextEditor.document.fileName !== fileName
				) {
					return;
				}

				const result = extensionStateManager
					.executeCommand(
						fileName,
						oldIndex,
						newIndex,
						characterDifference,
					);

				if (!result) {
					return;
				}

				const range = new vscode.Range(
				    new vscode.Position(
						result.range[0],
						result.range[1],
				    ),
				    new vscode.Position(
						result.range[2],
						result.range[3],
				    ),
				);

				const document = vscode.workspace.textDocuments.find(
					(document) => document.fileName === fileName
				);

				await vscode.window.activeTextEditor?.edit(
				    (textEditorEdit) => {
				        textEditorEdit.replace(
				            range,
				            result.text,
				        );
				    },
				);

				const position = new vscode.Position(
					result.position[0],
					result.position[1],
				);

				const selection = new vscode.Selection(
					position,
					position
				);

				activeTextEditor.selections = [ selection ];

				activeTextEditor.revealRange(
				    new vscode.Range(
						position,
						position
					),
				    vscode
						.TextEditorRevealType
						.AtTop,
				);

			}
		),
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(
			({ document, contentChanges })=> {
				const ranges: ReadonlyArray<IntuitaRange> = contentChanges.map((event) => {
					const {
						start,
						end,
					} = event.range;

					return [
						start.line,
						start.character,
						end.line,
						end.character,
					];
				});

				extensionStateManager
					.onFileTextChanged(
						document,
						ranges,
					);
			})
		);

	context.subscriptions.push(diagnosticCollection);

	console.log('Activated the Intuita VSCode Extension');
}

// this method is called when your extension is deactivated
export function deactivate() {}
