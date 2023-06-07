import * as vscode from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';
import { getConfiguration } from './configuration';
import { buildContainer } from './container';
import { Command, MessageBus, MessageKind } from './components/messageBus';
import { JobManager } from './components/jobManager';
import { FileService } from './components/fileService';
import { JobHash } from './jobs/types';
import { CaseManager } from './cases/caseManager';
import { CaseHash } from './cases/types';
import { DownloadService } from './components/downloadService';
import { FileSystemUtilities } from './components/fileSystemUtilities';
import { EngineService, Messages } from './components/engineService';
import { BootstrapExecutablesService } from './components/bootstrapExecutablesService';
import { PersistedStateService } from './persistedState/persistedStateService';
import { getPersistedState } from './persistedState/getPersistedState';
import {
	mapPersistedCaseToCase,
	mapPersistedJobToJob,
} from './persistedState/mappers';
import { buildExecutionId } from './telemetry/hashes';
import { IntuitaTextDocumentContentProvider } from './components/textDocumentContentProvider';
import { ElementHash } from './elements/types';
import { FileExplorerProvider } from './components/webview/FileExplorerProvider';
import { CampaignManagerProvider } from './components/webview/CampaignManagerProvider';
import { DiffWebviewPanel } from './components/webview/DiffWebviewPanel';
import { CodemodListPanelProvider } from './components/webview/CodemodListProvider';
import { CodemodService } from './packageJsonAnalyzer/codemodService';
import { CodemodHash } from './packageJsonAnalyzer/types';
import { CommunityProvider } from './components/webview/CommunityProvider';
import { UserHooksService } from './components/hooks';
import { VscodeTelemetry } from './telemetry/vscodeTelemetry';
import { TextDocumentContentProvider } from './components/webview/VirtualDocumentProvider';
import { applyChangesCoded } from './components/sourceControl/codecs';
import prettyReporter from 'io-ts-reporters';
import { ErrorWebviewProvider } from './components/webview/ErrorWebviewProvider';
import { WorkspaceState } from './persistedState/workspaceState';

const CODEMOD_METADATA_SCHEME = 'codemod';

const messageBus = new MessageBus();

export async function activate(context: vscode.ExtensionContext) {
	messageBus.setDisposables(context.subscriptions);

	const configurationContainer = buildContainer(getConfiguration());

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			configurationContainer.set(getConfiguration());
		}),
	);

	const persistedState = await getPersistedState(
		vscode.workspace.fs,
		() => context.storageUri ?? null,
	);

	const fileService = new FileService(messageBus);

	const jobManager = new JobManager(
		persistedState?.jobs.map((job) => mapPersistedJobToJob(job)) ?? [],
		(persistedState?.appliedJobsHashes ?? []) as JobHash[],
		messageBus,
		fileService,
	);

	const caseManager = new CaseManager(
		persistedState?.cases.map((kase) => mapPersistedCaseToCase(kase)) ?? [],
		new Set(persistedState?.caseHashJobHashes),
		messageBus,
	);

	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;

	const fileSystemUtilities = new FileSystemUtilities(vscode.workspace.fs);

	const downloadService = new DownloadService(
		vscode.workspace.fs,
		fileSystemUtilities,
	);

	const workspaceState = new WorkspaceState(
		context.workspaceState,
		rootPath ?? '/',
		messageBus,
	);

	const engineService = new EngineService(
		configurationContainer,
		messageBus,
		vscode.workspace.fs,
		workspaceState,
	);

	new BootstrapExecutablesService(
		downloadService,
		context.globalStorageUri,
		vscode.workspace.fs,
		messageBus,
	);

	new PersistedStateService(
		caseManager,
		vscode.workspace.fs,
		() => context.storageUri ?? null,
		jobManager,
		messageBus,
	);

	const intuitaTextDocumentContentProvider =
		new IntuitaTextDocumentContentProvider();

	const codemodService = new CodemodService(rootPath, engineService);

	const codemodListWebviewProvider = new CodemodListPanelProvider(
		context,
		messageBus,
		rootPath,
		codemodService,
		workspaceState,
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'intuita-available-codemod-tree-view',
			codemodListWebviewProvider,
		),
	);

	const telemetryKey = '63abdc2f-f7d2-4777-a320-c0e596a6f114';
	const vscodeTelemetry = new VscodeTelemetry(
		new TelemetryReporter(telemetryKey),
		messageBus,
	);

	const textContentProvider = new TextDocumentContentProvider(
		downloadService,
		vscode.workspace.fs,
		context.globalStorageUri,
		messageBus,
	);

	context.subscriptions.push(
		vscode.workspace.registerTextDocumentContentProvider(
			CODEMOD_METADATA_SCHEME,
			textContentProvider,
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.showCodemodMetadata',
			async (arg0?: unknown) => {
				try {
					const name = typeof arg0 === 'string' ? arg0 : null;

					if (name === null) {
						throw new Error(`Expected codemod name, got ${arg0}`);
					}

					const uri = vscode.Uri.parse(
						`${CODEMOD_METADATA_SCHEME}:${name}.md`,
					);

					const metadataExist = textContentProvider.hasMetadata(uri);

					if (!metadataExist) {
						return;
					}

					vscode.commands.executeCommand('markdown.showPreview', uri);
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openCaseDiff',
			async (caseHash?: ElementHash) => {
				if (!caseHash || !rootPath) {
					return;
				}
				try {
					const panelInstance = DiffWebviewPanel.getInstance(
						{
							type: 'intuitaPanel',
							title: 'Diff',
							extensionUri: context.extensionUri,
							initialData: {},
							viewColumn: vscode.ViewColumn.One,
							webviewName: 'jobDiffView',
						},
						messageBus,
						jobManager,
						caseManager,
						rootPath,
					);
					await panelInstance.render();
					const viewProps = await panelInstance.getViewDataForCase(
						caseHash,
					);

					if (!viewProps) {
						return;
					}
					const { title, data, stagedJobs } = viewProps;
					panelInstance.setTitle(title);

					const isExecutionInProgress =
						engineService.isExecutionInProgress();

					const { onDryRunCompleted } = getConfiguration();
					const showHooksCTA = onDryRunCompleted === null;

					panelInstance.setView({
						viewId: 'jobDiffView',
						viewProps: {
							showHooksCTA,
							loading: isExecutionInProgress,
							diffId: String(caseHash) as CaseHash,
							title,
							data,
							stagedJobs,
						},
					});
				} catch (err) {
					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.openCaseDiff',
					});
					console.error(err);
				}
			},
		),
	);

	const fileExplorerProvider = new FileExplorerProvider(
		context,
		messageBus,
		jobManager,
		caseManager,
		workspaceState,
	);

	const intuitaFileExplorer = vscode.window.registerWebviewViewProvider(
		'intuitaFileExplorer',
		fileExplorerProvider,
	);

	context.subscriptions.push(intuitaFileExplorer);

	const campaignManagerProvider = new CampaignManagerProvider(
		context,
		messageBus,
		jobManager,
		caseManager,
		workspaceState,
	);

	const intuitaCampaignManager = vscode.window.registerWebviewViewProvider(
		'intuitaCampaignManager',
		campaignManagerProvider,
	);

	context.subscriptions.push(intuitaCampaignManager);

	const communityProvider = new CommunityProvider(context);

	const intuitaCommunityView = vscode.window.registerWebviewViewProvider(
		'intuitaCommunityView',
		communityProvider,
	);

	context.subscriptions.push(intuitaCommunityView);

	if (rootPath) {
		new UserHooksService(messageBus, { getConfiguration }, rootPath);
	}

	const errorWebviewProvider = new ErrorWebviewProvider(
		context,
		messageBus,
		workspaceState,
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.focusView',
			(arg0: unknown) => {
				const webviewName = typeof arg0 === 'string' ? arg0 : null;
				if (webviewName === null) {
					return;
				}

				if (webviewName === 'changeExplorer') {
					fileExplorerProvider.focusMostRecentNode();
				}

				if (webviewName === 'diffView' && rootPath !== null) {
					const panelInstance = DiffWebviewPanel.getInstance(
						{
							type: 'intuitaPanel',
							title: 'Diff',
							extensionUri: context.extensionUri,
							initialData: {},
							viewColumn: vscode.ViewColumn.One,
							webviewName: 'jobDiffView',
						},
						messageBus,
						jobManager,
						caseManager,
						rootPath,
					);
					panelInstance.focusView();
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.disposeView',
			(arg0: unknown) => {
				const webviewName = typeof arg0 === 'string' ? arg0 : null;
				if (webviewName === null) {
					return;
				}

				if (webviewName === 'diffView' && rootPath !== null) {
					const panelInstance = DiffWebviewPanel.getInstance(
						{
							type: 'intuitaPanel',
							title: 'Diff',
							extensionUri: context.extensionUri,
							initialData: {},
							viewColumn: vscode.ViewColumn.One,
							webviewName: 'jobDiffView',
						},
						messageBus,
						jobManager,
						caseManager,
						rootPath,
					);
					panelInstance.dispose();
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.redirect', (arg0) => {
			try {
				vscode.env.openExternal(vscode.Uri.parse(arg0));
			} catch (e) {
				vscode.window.showWarningMessage('Invalid URL:' + arg0);
			}
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.shutdownEngines', () => {
			engineService.shutdownEngines();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.clearOutputFiles',
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				await engineService.clearOutputFiles(storageUri);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sourceControl.saveStagedJobsToTheFileSystem',
			async (arg0: unknown) => {
				try {
					const decoded = applyChangesCoded.decode(arg0);

					if (decoded._tag === 'Left') {
						throw new Error(
							prettyReporter.report(decoded).join('\n'),
						);
					}

					const { jobHashes, diffId: caseHash } = decoded.right;

					await jobManager.acceptJobs(
						new Set(jobHashes as JobHash[]),
					);

					vscode.commands.executeCommand(
						'intuita.rejectCase',
						caseHash,
					);

					vscode.commands.executeCommand('workbench.view.scm');
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName:
							'intuita.sourceControl.saveStagedJobsToTheFileSystem',
					});
					vscode.window.showErrorMessage(message);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.rejectCase', async (arg0) => {
			try {
				const caseHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;

				if (caseHash === null) {
					throw new Error(
						'Did not pass the caseHash into the command.',
					);
				}

				messageBus.publish({
					kind: MessageKind.rejectCase,
					caseHash: caseHash as CaseHash,
				});

				messageBus.publish({
					kind: MessageKind.updateElements,
				});

				fileExplorerProvider.clearView();
			} catch (e) {
				const message = e instanceof Error ? e.message : String(e);
				vscode.window.showErrorMessage(message);

				vscodeTelemetry.sendError({
					kind: 'failedToExecuteCommand',
					commandName: 'intuita.rejectCase',
				});
			}
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openChangeExplorer',
			async (caseHash: CaseHash | null) => {
				if (caseHash === null) {
					return;
				}

				fileExplorerProvider.setCaseHash(caseHash);
				fileExplorerProvider.showView();
				fileExplorerProvider.setView(caseHash);

				errorWebviewProvider.showView();
				errorWebviewProvider.setView();
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeAsCodemod',
			async (uri: vscode.Uri) => {
				try {
					const rootUri = vscode.workspace.workspaceFolders?.[0]?.uri;

					if (!rootUri) {
						throw new Error('No workspace has been opened.');
					}

					const { storageUri } = context;

					if (!storageUri) {
						throw new Error(
							'No storage URI, aborting the command.',
						);
					}

					const happenedAt = String(Date.now());
					const executionId = buildExecutionId();

					const fileStat = await vscode.workspace.fs.stat(uri);
					const directory = Boolean(
						fileStat.type & vscode.FileType.Directory,
					);

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command: {
							uri: rootUri,
							storageUri,
							fileUri: uri,
							directory,
						},
						happenedAt,
						executionId,
					});
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.executeAsCodemod',
					});
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeCodemod',
			async (uri: vscode.Uri, hashDigest: CodemodHash) => {
				try {
					const { storageUri } = context;

					if (!storageUri) {
						throw new Error(
							'No storage URI, aborting the command.',
						);
					}

					const executionId = buildExecutionId();
					const happenedAt = String(Date.now());

					let command: Command;

					if (hashDigest === 'QKEdp-pofR9UnglrKAGDm1Oj6W0') {
						command = {
							kind: 'repomod',
							inputPath: uri,
							storageUri,
							repomodFilePath: hashDigest,
						};
					} else {
						const fileStat = await vscode.workspace.fs.stat(uri);
						const directory = Boolean(
							fileStat.type & vscode.FileType.Directory,
						);

						command = {
							kind: 'executeCodemod',
							storageUri,
							codemodHash: hashDigest,
							uri,
							directory,
						};
					}

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command,
						executionId,
						happenedAt,
					});

					vscode.commands.executeCommand(
						'workbench.view.extension.intuitaViewId',
					);

					// opens "Codemod Runs" panel if not opened
					campaignManagerProvider.showView();
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.executeCodemod',
					});
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeCodemodWithinPath',
			async (uriArg: vscode.Uri) => {
				try {
					const { storageUri } = context;

					if (!storageUri) {
						throw new Error(
							'No storage URI, aborting the command.',
						);
					}

					const uri =
						(uriArg ||
							vscode.window.activeTextEditor?.document.uri) ??
						null;

					if (uri === null) {
						return;
					}

					const codemodList = await engineService.getCodemodList();

					// order: least recent to most recent
					const top3RecentCodemodHashes =
						codemodListWebviewProvider.getRecentCodemodHashes();

					const top3RecentCodemods = codemodList.filter((codemod) =>
						top3RecentCodemodHashes.includes(
							codemod.hashDigest as CodemodHash,
						),
					);

					// order: least recent to most recent
					top3RecentCodemods.sort((a, b) => {
						return (
							top3RecentCodemodHashes.indexOf(
								a.hashDigest as CodemodHash,
							) -
							top3RecentCodemodHashes.indexOf(
								b.hashDigest as CodemodHash,
							)
						);
					});
					const sortedCodemodList = [
						...top3RecentCodemods.reverse(),
						...codemodList.filter(
							(codemod) =>
								!top3RecentCodemodHashes.includes(
									codemod.hashDigest as CodemodHash,
								),
						),
					];

					const quickPickItem =
						(await vscode.window.showQuickPick(
							sortedCodemodList.map(({ name, hashDigest }) => ({
								label: name,
								...(top3RecentCodemodHashes.includes(
									hashDigest as CodemodHash,
								) && { description: '(recent)' }),
							})),
							{
								placeHolder:
									'Pick a codemod to execute over the selected path',
							},
						)) ?? null;

					if (quickPickItem === null) {
						return;
					}

					const selectedCodemod = sortedCodemodList.find(
						({ name }) => name === quickPickItem.label,
					);

					if (!selectedCodemod) {
						throw new Error('Codemod is not selected');
					}

					await codemodListWebviewProvider.updateExecutionPath({
						newPath: uri.path,
						codemodHash: selectedCodemod.hashDigest as CodemodHash,
						fromVSCodeCommand: true,
						errorMessage: null,
						warningMessage: null,
						revertToPrevExecutionIfInvalid: false,
					});

					vscode.commands.executeCommand(
						'workbench.view.extension.intuitaViewId',
					);

					setTimeout(() => {
						messageBus.publish({
							kind: MessageKind.focusCodemod,
							codemodHashDigest:
								selectedCodemod.hashDigest as CodemodHash,
						});
					}, 500);

					const executionId = buildExecutionId();
					const happenedAt = String(Date.now());

					const fileStat = await vscode.workspace.fs.stat(uri);
					const directory = Boolean(
						fileStat.type & vscode.FileType.Directory,
					);

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command: {
							kind: 'executeCodemod',
							storageUri,
							codemodHash:
								selectedCodemod.hashDigest as CodemodHash,
							uri,
							directory,
						},
						executionId,
						happenedAt,
					});

					// opens "Codemod Runs" panel if not opened
					campaignManagerProvider.showView();
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.executeCodemodWithinPath',
					});
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeImportedModOnPath',
			async (uri: vscode.Uri) => {
				try {
					const { storageUri } = context;

					if (!storageUri) {
						throw new Error(
							'No storage URI, aborting the command.',
						);
					}

					const modUri = vscode.Uri.joinPath(
						storageUri,
						'jscodeshiftCodemod.ts',
					);

					const document = await vscode.workspace.openTextDocument(
						intuitaTextDocumentContentProvider.URI,
					);

					const text = document.getText();

					// `jscodeshiftCodemod.ts` is empty or the file doesn't exist
					if (!text) {
						vscode.window.showWarningMessage(
							Messages.noImportedMod,
						);
						return;
					}

					const buffer = Buffer.from(text);
					const content = new Uint8Array(buffer);
					vscode.workspace.fs.writeFile(modUri, content);

					const happenedAt = String(Date.now());
					const executionId = buildExecutionId();

					const fileStat = await vscode.workspace.fs.stat(uri);
					const directory = Boolean(
						fileStat.type & vscode.FileType.Directory,
					);

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command: {
							uri,
							storageUri,
							fileUri: modUri,
							directory,
						},
						happenedAt,
						executionId,
					});
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.executeImportedModOnPath',
					});
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (!event.affectsConfiguration('intuita')) {
				return;
			}

			messageBus.publish({
				kind: MessageKind.configurationChanged,
				nextConfiguration: getConfiguration(),
			});

			messageBus.publish({
				kind: MessageKind.updateElements,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.clearState', () => {
			messageBus.publish({
				kind: MessageKind.clearState,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sendAsBeforeSnippet',
			async () => {
				const { activeTextEditor } = vscode.window;

				if (!activeTextEditor) {
					console.error(
						'No active text editor, sendAsBeforeSnippet will not be executed',
					);
					return;
				}

				const selection = activeTextEditor.selection;
				const text = activeTextEditor.document.getText(selection);

				const beforeSnippet = Buffer.from(text).toString('base64url');

				const uri = vscode.Uri.parse(
					`https://codemod.studio?beforeSnippet=${beforeSnippet}`,
				);

				await vscode.env.openExternal(uri);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sendAsAfterSnippet',
			async () => {
				const { activeTextEditor } = vscode.window;

				if (!activeTextEditor) {
					console.error(
						'No active text editor, sendAsAfterSnippet will not be executed',
					);
					return;
				}

				const selection = activeTextEditor.selection;
				const text = activeTextEditor.document.getText(selection);

				const afterSnippet = Buffer.from(text).toString('base64url');

				const uri = vscode.Uri.parse(
					`https://codemod.studio?afterSnippet=${afterSnippet}`,
				);

				await vscode.env.openExternal(uri);
			},
		),
	);

	context.subscriptions.push(
		vscode.workspace.registerTextDocumentContentProvider(
			'intuita',
			intuitaTextDocumentContentProvider,
		),
	);

	context.subscriptions.push(
		vscode.window.registerUriHandler({
			handleUri: async (uri) => {
				const searchParams = new URLSearchParams(uri.query);
				const base64UrlEncodedContent = searchParams.get('c');
				const codemodHashDigest = searchParams.get('chd');

				if (base64UrlEncodedContent) {
					const buffer = Buffer.from(
						base64UrlEncodedContent,
						'base64url',
					);

					const content = buffer.toString('utf8');

					intuitaTextDocumentContentProvider.setContent(content);

					const document = await vscode.workspace.openTextDocument(
						intuitaTextDocumentContentProvider.URI,
					);

					vscode.window.showTextDocument(document);
				} else if (codemodHashDigest !== null) {
					vscode.commands.executeCommand(
						'workbench.view.extension.intuitaViewId',
					);

					setTimeout(() => {
						messageBus.publish({
							kind: MessageKind.focusCodemod,
							codemodHashDigest: codemodHashDigest as CodemodHash,
						});
					}, 500);
				}
			},
		}),
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'intuitaErrorViewId',
			errorWebviewProvider,
		),
	);

	messageBus.publish({
		kind: MessageKind.updateElements,
	});

	// const dependencyService = new DependencyService(messageBus);

	// dependencyService.showInformationMessagesAboutUpgrades();

	messageBus.publish({
		kind: MessageKind.bootstrapEngine,
	});
}
