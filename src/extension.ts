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
import {getConfiguration, RecommendationBlockTrigger} from './configuration';
import {ExtensionStateManager, IntuitaDiagnostic} from "./features/moveTopLevelNode/extensionStateManager";
import {buildHash, IntuitaRange, isNeitherNullNorUndefined} from "./utilities";
import {RangeCriterion, RangeCriterionKind} from "./features/moveTopLevelNode/1_userCommandBuilder";
import {buildContainer} from "./container";
import { buildRecommendationHash } from './features/moveTopLevelNode/recommendationHash';

export async function activate(
	context: vscode.ExtensionContext,
) {
	const configurationContainer = buildContainer(
		getConfiguration()
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(
			() => {
				configurationContainer.set(
					getConfiguration()
				);
			}
		)
	);

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
		configurationContainer,
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
			range: IntuitaRange,
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
							if (diagnostics.length === 0) {
								return null;
							}

							let label = document.fileName.replace(rootPath, '');

							const children: Element[] = diagnostics
								.map(
									(diagnostic) => {
										return {
											kind: 'DIAGNOSTIC' as const,
											label: diagnostic.title,
											fileName: document.fileName,
											uri: document.uri,
											oldIndex: diagnostic.oldIndex,
											newIndex: diagnostic.newIndex,
											range: diagnostic.range,
										};
									}
								);

							return {
								kind: 'FILE' as const,
								label,
								children,
							};
						}
					)
					.filter(isNeitherNullNorUndefined);

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
					title: 'Diff View',
					command: 'vscode.diff',
					arguments: [
						element.uri,
						vscode.Uri.parse(
							'intuita:moveTopLevelNode.ts'
							+ `?fileName=${encodeURIComponent(element.fileName)}`
							+ `&oldIndex=${String(element.oldIndex)}`
							+ `&newIndex=${String(element.newIndex)}`,
							true,
						),
						'Proposed change',
					]
				};
			}

			return treeItem;
		},
		onDidChangeTreeData: _onDidChangeTreeData.event,
	};

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'explorerIntuitaViewId',
			treeDataProvider
		)
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'intuitaViewId',
			treeDataProvider
		)
	);

	// vscode.window.withProgress( 
	// 	{
	// 		location: {
	// 			viewId: 'intuitaViewId',
	// 		}
	// 	},
	// 	async (progress) => {
	// 		return new Promise<void>(
	// 			(resolve, reject) => {
	// 				setTimeout(
	// 					() => {
	// 						progress.report({
	// 							increment: 10,
	// 						})

	// 						reject();

	// 						// resolve();
	// 					},
	// 					10000,
	// 				);
	// 			}
	// 		)
	// 	}
	// )

	

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
		rangeCriterion: RangeCriterion,
	) => {
		extensionStateManager
			.onFileTextChanged(
				document,
				rangeCriterion,
			);

		_onDidChangeTreeData.fire();
	};

	if (vscode.window.activeTextEditor) {
		const rangeCriterion: RangeCriterion =
			configurationContainer.get().recommendationBlockTrigger === RecommendationBlockTrigger.all
				? {
					kind: RangeCriterionKind.DOCUMENT,
				}
				: {
					kind: RangeCriterionKind.RANGES,
					ranges: [],
				};

		activeTextEditorChangedCallback(
			vscode
				.window
				.activeTextEditor
				.document,
			rangeCriterion,
		);
	}

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(
			(textEditor) => {
				if (!textEditor) {
					return;
				}
				const rangeCriterion: RangeCriterion =
					configurationContainer.get().recommendationBlockTrigger === RecommendationBlockTrigger.all
						? {
							kind: RangeCriterionKind.DOCUMENT,
						}
						: {
							kind: RangeCriterionKind.RANGES,
							ranges: [],
						};

				return activeTextEditorChangedCallback(
					textEditor
						.document,
					rangeCriterion,
				);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.acceptRecommendation',
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


				vscode.commands.executeCommand(
					'intuita.moveTopLevelNode',
					{
						fileName,
						oldIndex,
						newIndex,
						characterDifference: 0,
					}
				)
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.rejectRecommendation',
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

				if (
					fileName === null
					|| oldIndex === null
					|| newIndex === null
				) {
					throw new Error('Did not pass file name or old index or new index.');
				}

				const recommendationHash = buildRecommendationHash(
					fileName,
					oldIndex,
					newIndex,
				);

				extensionStateManager.rejectRecommendation(recommendationHash);
			}
		)
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

				const textEditors = vscode
					.window
					.visibleTextEditors
					.filter(
						({ document }) => {
							return document.fileName === fileName;
						},
					);

				const textDocuments = vscode
					.workspace
					.textDocuments
					.filter(
						(document) => {
							return document.fileName === fileName;
						},
					);

				const activeTextEditor = vscode.window.activeTextEditor ?? null;

				if (
					fileName === null
					|| oldIndex === null
					|| newIndex === null
					|| characterDifference === null
				) {
					throw new Error('Requirements were not met.');
				}

				const result = extensionStateManager
					.executeCommand(
						fileName,
						oldIndex,
						newIndex,
						characterDifference,
					);

				if (!result) {
					throw new Error();
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

				await Promise.all(
					textEditors.map(
						(textEditor) => {
							return textEditor.edit(
								(textEditorEdit) => {
									textEditorEdit.replace(
										range,
										result.text,
									);
								}
							);
						}
					)
				);

				if (textEditors.length === 0) {
					textDocuments.forEach(
						(textDocument) => {
							vscode
								.window
								// TODO we can add a range here
								.showTextDocument(textDocument)
								.then(
									(textEditor) => {
										return textEditor.edit(
											(textEditorEdit) => {
												textEditorEdit.replace(
													range,
													result.text,
												);
											}
										);
									}
								)
						}
					)
				}

				if (activeTextEditor?.document.fileName === fileName) {
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
						{
							kind: RangeCriterionKind.RANGES,
							ranges,
						},
					);

				_onDidChangeTreeData.fire();
			})
		);

	context.subscriptions.push(diagnosticCollection);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.acceptRecommendationFromVirtualDocument',
			async (args) => {
				const query: string = args.query;

				const urlSearchParams = new URLSearchParams(query);

				const fileName = urlSearchParams.get('fileName')
				const oldIndex = urlSearchParams.get('oldIndex');
				const newIndex = urlSearchParams.get('newIndex');

				if (
					fileName === null
					|| oldIndex === null
					|| newIndex === null
				) {
					throw new Error('Did not pass file name or old index or new index.');
				}

				await vscode.commands.executeCommand(
					'workbench.action.closeActiveEditor',
				);

				await vscode.commands.executeCommand(
					'intuita.moveTopLevelNode',
					{
						fileName,
						oldIndex: Number(oldIndex),
						newIndex: Number(newIndex),
						characterDifference: 0,
					},
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.rejectRecommendationFromVirtualDocument',
			async (args) => {
				console.log('args', args);
			},
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.showNextRecommendationFromVirtualDocument',
			async (args) => {
				console.log('args', args);
			},
		),
	);

	console.log('Activated the Intuita VSCode Extension');
}

// this method is called when your extension is deactivated
export function deactivate() {}
