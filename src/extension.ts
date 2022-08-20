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
import {ExtensionStateManager, IntuitaRecommendation} from "./features/moveTopLevelNode/extensionStateManager";
import {buildHash, IntuitaRange, isNeitherNullNorUndefined} from "./utilities";
import {RangeCriterion, RangeCriterionKind} from "./features/moveTopLevelNode/1_userCommandBuilder";
import {buildContainer} from "./container";
import { buildRecommendationHash, RecommendationHash } from './features/moveTopLevelNode/recommendationHash';
import path = require('node:path');

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
		intuitaDiagnostics: ReadonlyArray<IntuitaRecommendation>
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

		_onDidChangeTreeData.fire();
	};

	const extensionStateManager = new ExtensionStateManager(
		configurationContainer,
		_setDiagnosticEntry,
	);

	// move Element, _onDidChangeTreeData and treeDataProvider to a separate file

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
			hash: RecommendationHash,
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
						({ document, recommendations }) => {
							if (recommendations.length === 0) {
								return null;
							}

							const label: string = document.fileName.replace(rootPath, '');

							const children: Element[] = recommendations
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
											hash: diagnostic.hash,
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

			treeItem.iconPath = path.join(
				__filename,
				'..',
				'..',
				'resources',
				element.kind === 'FILE' ? 'ts2.svg' : 'bluelightbulb.svg'
			);

			if (element.kind === 'DIAGNOSTIC') {
				treeItem.contextValue = 'intuitaJob';

				const jobHash = buildRecommendationHash(
					element.fileName,
					element.oldIndex,
					element.newIndex,
				);

				treeItem.command = {
					title: 'Diff View',
					command: 'vscode.diff',
					arguments: [
						element.uri,
						vscode.Uri.parse(
							`intuita:moveTopLevelNode.ts?hash=${jobHash}`,
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

	const textDocumentContentProvider: vscode.TextDocumentContentProvider = {
		provideTextDocumentContent(
			uri: vscode.Uri
		): string {
			const searchParams = new URLSearchParams(uri.query);

			const jobHash = searchParams.get('hash');

			if (jobHash === null) {
				throw new Error('Did not pass the job hash parameter "hash".');
			}

			return extensionStateManager.getText(
				jobHash as RecommendationHash,
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
			'intuita.requestFeature',
			() => {
				vscode.env.openExternal(
					vscode.Uri.parse('https://feedback.intuita.io/')
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
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.rejectRecommendation',
			async (args) => {
				const jobHash: string | null = (typeof args === 'object' && typeof args.hash === 'string')
					? args.hash
					: null;

				if (jobHash === null) {
					throw new Error('Did not pass the job hash argument "hash".');
				}

				extensionStateManager.rejectRecommendation(
					jobHash as RecommendationHash,
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.moveTopLevelNode',
			async (args) => {
				if (!Array.isArray(args)) {
					throw new Error('Arguments of the "intuita.moveTopLevelNode" command must be an array');
				}

				const jobHash = typeof args[0] === 'string'
					? args[0]
					: null;

				const characterDifference = typeof args[1] === 'number'
					? args[1]
					: null;

				if (jobHash === null || characterDifference === null) {
					throw new Error('Did not pass the job hash argument or the character difference argument.');
				}

				// TODO: job doesn't have to be retrieved to get the fileName
				const job = extensionStateManager._recommendationMap.get(
					jobHash as RecommendationHash
				);

				if (!job) {
					throw new Error();
				}

				const textEditors = vscode
					.window
					.visibleTextEditors
					.filter(
						({ document }) => {
							return document.fileName === job.fileName;
						},
					);

				const textDocuments = vscode
					.workspace
					.textDocuments
					.filter(
						(document) => {
							return document.fileName === job.fileName;
						},
					);

				const activeTextEditor = vscode.window.activeTextEditor ?? null;

				const result = extensionStateManager
					.executeCommand(
						// TODO have executeCommand work on a jobHash
						// TODO have the result include the fileName
						job.fileName,
						job.oldIndex,
						job.newIndex,
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

				if (activeTextEditor?.document.fileName === job.fileName) {
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
			})
		);

	context.subscriptions.push(diagnosticCollection);

	console.log('Activated the Intuita VSCode Extension');
}

// this method is called when your extension is deactivated
export function deactivate() {}
