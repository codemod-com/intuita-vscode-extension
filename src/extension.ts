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
import {getConfiguration, JobBlockTrigger} from './configuration';
import {ExtensionStateManager, IntuitaJob} from "./features/moveTopLevelNode/extensionStateManager";
import {buildHash, IntuitaRange, isNeitherNullNorUndefined} from "./utilities";
import {RangeCriterion, RangeCriterionKind} from "./features/moveTopLevelNode/1_userCommandBuilder";
import {buildContainer} from "./container";
import { buildJobHash, JobHash } from './features/moveTopLevelNode/jobHash';
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
		intuitaDiagnostics: ReadonlyArray<IntuitaJob>
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

	// TODO move Element, _onDidChangeTreeData and treeDataProvider to a separate file

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
			hash: JobHash,
			fileName: string,
			oldIndex: number,
			newIndex: number,
			range: IntuitaRange,
			score: number,
		}>;

	const _onDidChangeTreeData = new vscode.EventEmitter<Element | undefined | null | void>();

	const treeDataProvider: TreeDataProvider<Element> = {
		getChildren(element: Element | undefined): ProviderResult<Element[]> {
			if (element === undefined) {
				const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.path ?? '';

				const documents = extensionStateManager.getDocuments();

				const elements: Element[] = documents
					.map(
						({ document, jobs }) => {
							if (jobs.length === 0) {
								return null;
							}

							const label: string = document.fileName.replace(rootPath, '');

							const children: Element[] = jobs
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
											score: diagnostic.score,
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

				const tooltip = new vscode.MarkdownString(
					'Adhere to the code organization rules [here](command:intuita.openTopLevelNodeKindOrderSetting)'
				);

				tooltip.isTrusted = true;

				treeItem.tooltip = tooltip;

				const jobHash = buildJobHash(
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
				jobHash as JobHash,
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
			configurationContainer.get().jobBlockTrigger === JobBlockTrigger.all
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
					configurationContainer.get().jobBlockTrigger === JobBlockTrigger.all
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
			'intuita.acceptJob',
			async (args) => {
				const jobHash: string | null = (typeof args === 'object' && typeof args.hash === 'string')
					? args.hash
					: null;

				if (jobHash === null) {
					throw new Error('Did not pass the job hash argument "hash".');
				}

				await vscode.commands.executeCommand(
					'intuita.moveTopLevelNode',
					jobHash,
					0, // characterDifference
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.rejectJob',
			async (args) => {
				const jobHash: string | null = (typeof args === 'object' && typeof args.hash === 'string')
					? args.hash
					: null;

				if (jobHash === null) {
					throw new Error('Did not pass the job hash argument "hash".');
				}

				extensionStateManager.rejectJob(
					jobHash as JobHash,
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openTopLevelNodeKindOrderSetting',
			() => {
				return vscode.commands.executeCommand(
					'workbench.action.openSettings',
					'intuita.topLevelNodeKindOrder',
				);
			}
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.moveTopLevelNode',
			async (jobHash, characterDifference) => {
				if (typeof jobHash !== 'string') {
					throw new Error('The job hash argument must be a string.');
				}
					
				if (typeof characterDifference !== 'number') {
					throw new Error('The job hash argument must be a number.');
				}

				const result = extensionStateManager
					.executeCommand(
						jobHash as JobHash,
						characterDifference,
					);

				if (!result) {
					throw new Error();
				}

				const { fileName } = result;

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

				const {
					saveDocumentOnJobAccept,
				} = configurationContainer.get();

				const changeTextEditor = async (textEditor: vscode.TextEditor) => {
					await textEditor.edit(
						(textEditorEdit) => {
							textEditorEdit.replace(
								range,
								result.text,
							);
						}
					);
					
					if (!saveDocumentOnJobAccept) {
						return;
					}

					return textEditor.document.save();
				};

				await Promise.all(
					textEditors.map(
						changeTextEditor,
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
									changeTextEditor,
								);
						}
					);
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

				const allTextDocuments = textEditors
					.map(({ document }) => document)
					.concat(
						textDocuments
					);

				if (allTextDocuments[0]) {
					extensionStateManager
						.onFileTextChanged(
							allTextDocuments[0],
							{
								kind: RangeCriterionKind.DOCUMENT,
							},
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
