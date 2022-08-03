import * as vscode from 'vscode';
import {
	Diagnostic,
	DiagnosticSeverity,
	Position,
	ProviderResult,
	Range,
	TreeDataProvider,
	TreeItem,
	TreeItemCollapsibleState
} from 'vscode';
import {MoveTopLevelNodeActionProvider} from './actionProviders/moveTopLevelNodeActionProvider';
import {getConfiguration} from './configuration';
import {ExtensionStateManager, IntuitaDiagnostic} from "./features/moveTopLevelNode/extensionStateManager";
import {buildHash, IntuitaRange} from "./utilities";

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

	type Element =
		| Readonly<{
			kind: 'FILE',
			label: string,
			children: ReadonlyArray<Element>,
		}>
		| Readonly<{
			kind: 'DIAGNOSTIC',
			label: string,
			uri: vscode.Uri,
			fileName: string,
			oldIndex: number,
			newIndex: number,
		}>;

	const _onDidChangeTreeData = new vscode.EventEmitter<Element | undefined | null | void>();

	const treeDataProvider: TreeDataProvider<Element> = {
		getChildren(element: Element | undefined): ProviderResult<Element[]> {
			if (element === undefined) {
				const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.path ?? '';

				const documents = extensionStateManager.getDocuments();

				const elements: Element[] = documents
					.map(
						({ document, diagnostics }) => {
							let label = document.fileName.replace(rootPath, '');

							const children: Element[] = diagnostics
								.map(
									(diagnostic) => {
										return {
											kind: 'DIAGNOSTIC',
											label: diagnostic.title,
											fileName: document.fileName,
											uri: document.uri,
											oldIndex: diagnostic.oldIndex,
											newIndex: diagnostic.newIndex,
										};
									}
								);

							return {
								kind: 'FILE',
								label,
								children,
							};
						}
					);

				return Promise.resolve(elements);
			}

			if (element.kind === 'DIAGNOSTIC') {
				return Promise.resolve([]);
			}

			return Promise.resolve(
				element.children.slice()
			);
		},
		getTreeItem(element: Element): TreeItem | Thenable<TreeItem> {
			const treeItem = new TreeItem(
				element.label,
			);

			treeItem.id = buildHash(element.label);

			treeItem.collapsibleState = element.kind === 'FILE'
				? TreeItemCollapsibleState.Collapsed
				: TreeItemCollapsibleState.None;

			treeItem.iconPath = element.kind === 'FILE'
				? vscode.ThemeIcon.File
				: vscode.ThemeIcon.Folder;

			if (element.kind === 'DIAGNOSTIC') {
				treeItem.command = {
					title: 'Show difference',
					command: 'vscode.diff',
					arguments: [
						element.uri,
						vscode.Uri.parse(
							'intuita://moveTopLevelNode.ts'
							+ `?fileName=${encodeURIComponent(element.fileName)}`
							+ `&oldIndex=${String(element.oldIndex)}`
							+ `&newIndex=${String(element.newIndex)}`,
							true,
						),
					]
				};
			}

			return treeItem;
		},
		onDidChangeTreeData: _onDidChangeTreeData.event,
	};

	vscode.window.registerTreeDataProvider(
		'intuitaViewId',
		treeDataProvider
	);

	vscode.window.registerTreeDataProvider(
		'explorerIntuitaViewId',
		treeDataProvider
	);

	const textDocumentContentProvider: vscode.TextDocumentContentProvider = {
		provideTextDocumentContent(
			uri: vscode.Uri
		): string {
			const searchParams = new URLSearchParams(uri.query);

			const fileName = searchParams.get('fileName');
			const oldIndex = searchParams.get('oldIndex');
			const newIndex = searchParams.get('newIndex');

			if (
				fileName === null
				|| oldIndex === null
				|| newIndex === null
			) {
				throw new Error('Did not pass file name or old index or new index.');
			}

			const parsedOldIndex = parseInt(oldIndex, 10);
			const parsedNewIndex = parseInt(newIndex, 10);

			if (Number.isNaN(parsedOldIndex)) {
				return 'The old index could not have been parsed.'
			}

			if (Number.isNaN(parsedNewIndex)) {
				return 'The new index could not have been parsed.'
			}

			return extensionStateManager.getText(
				fileName,
				parsedOldIndex,
				parsedNewIndex,
			);
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

		_onDidChangeTreeData.fire();
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

				_onDidChangeTreeData.fire();
			})
		);

	context.subscriptions.push(diagnosticCollection);

	console.log('Activated the Intuita VSCode Extension');
}

// this method is called when your extension is deactivated
export function deactivate() {}
