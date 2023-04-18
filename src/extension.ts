import * as t from 'io-ts';
import * as vscode from 'vscode';
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
import { NoraCompareServiceEngine } from './components/noraCompareServiceEngine';
import { EngineService, Messages } from './components/engineService';
import { BootstrapExecutablesService } from './components/bootstrapExecutablesService';
import { StatusBarItemManager } from './components/statusBarItemManager';
import { PersistedStateService } from './persistedState/persistedStateService';
import { getPersistedState } from './persistedState/getPersistedState';
import {
	mapPersistedCaseToCase,
	mapPersistedJobToJob,
} from './persistedState/mappers';
import {
	dependencyNameToRecipeName,
	InformationMessageService,
} from './components/informationMessageService';
import { buildTypeCodec, isNeitherNullNorUndefined } from './utilities';
import prettyReporter from 'io-ts-reporters';
import { buildExecutionId } from './telemetry/hashes';
import { TelemetryService } from './telemetry/telemetryService';
import {
	projectNameCodec,
	PROJECT_NAMES,
	RECIPE_MAP,
	recipeNameCodec,
} from './recipes/codecs';
import { IntuitaTextDocumentContentProvider } from './components/textDocumentContentProvider';
import { GlobalStateAccountStorage } from './components/user/userAccountStorage';
import { AlreadyLinkedError, UserService } from './components/user/userService';
import {
	NotFoundIntuitaAccount,
	NotFoundRepositoryPath,
	SourceControlService,
} from './components/webview/sourceControl';
import { SourceControlWebviewPanel } from './components/webview/SourceControlWebviewPanel';
import { isAxiosError } from 'axios';
import { CodemodExecutionProgressWebviewViewProvider } from './components/progressProvider';
import { IntuitaTreeDataProvider } from './components/intuitaTreeDataProvider';
import { RepositoryService } from './components/webview/repository';
import { ElementHash } from './elements/types';

import type { GitExtension } from './types/git';
import { IntuitaProvider } from './components/webview/MainWebviewProvider';
import { CodemodTreeProvider } from './packageJsonAnalyzer/codemodList';
import { handleActiveTextEditor } from './packageJsonAnalyzer/inDocumentPackageAnalyzer';
import { CodemodHash } from './packageJsonAnalyzer/types';
import { DiffWebviewPanel } from './components/webview/DiffWebviewPanel';
import { getCaseUniqueName } from './cases/getCaseUniqueName';

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

	const jobManager = new JobManager(
		persistedState?.jobs.map((job) => mapPersistedJobToJob(job)) ?? [],
		persistedState?.acceptedJobsHashes as JobHash[],
		messageBus,
	);

	const caseManager = new CaseManager(
		persistedState?.cases.map((kase) => mapPersistedCaseToCase(kase)) ?? [],
		new Set(persistedState?.caseHashJobHashes),
		messageBus,
	);

	new FileService(messageBus);
	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;

	const codemodTreeProvider = new CodemodTreeProvider(
		rootPath ?? null,
		messageBus,
	);
	const treeDataProvider = new IntuitaTreeDataProvider(
		caseManager,
		messageBus,
		jobManager,
	);

	const codemodTreeView = vscode.window.createTreeView(
		'intuita-available-codemod-tree-view',
		{
			treeDataProvider: codemodTreeProvider,
		},
	);

	context.subscriptions.push(codemodTreeView);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'intuita-progress-webview',
			new CodemodExecutionProgressWebviewViewProvider(messageBus),
		),
	);

	const fileSystemUtilities = new FileSystemUtilities(vscode.workspace.fs);

	const downloadService = new DownloadService(
		vscode.workspace.fs,
		fileSystemUtilities,
	);

	const statusBarItem = vscode.window.createStatusBarItem(
		'intuita.statusBarItem',
		vscode.StatusBarAlignment.Right,
		100,
	);

	statusBarItem.command = 'intuita.shutdownEngines';

	context.subscriptions.push(statusBarItem);

	const statusBarItemManager = new StatusBarItemManager(statusBarItem);

	const engineService = new EngineService(
		configurationContainer,
		messageBus,
		vscode.workspace.fs,
		statusBarItemManager,
	);

	new BootstrapExecutablesService(
		downloadService,
		context.globalStorageUri,
		vscode.workspace.fs,
		messageBus,
		statusBarItemManager,
	);

	new NoraCompareServiceEngine(messageBus);

	const gitExtension =
		vscode.extensions.getExtension<GitExtension>('vscode.git');
	const activeGitExtension = gitExtension?.isActive
		? gitExtension.exports
		: await gitExtension?.activate();

	const git = activeGitExtension?.getAPI(1) ?? null;

	const repositoryService = new RepositoryService(
		git,
		messageBus,
		persistedState?.remoteUrl ?? null,
	);

	const persistedStateService = new PersistedStateService(
		caseManager,
		vscode.workspace.fs,
		() => context.storageUri ?? null,
		jobManager,
		messageBus,
		repositoryService,
	);

	const intuitaTextDocumentContentProvider =
		new IntuitaTextDocumentContentProvider();

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openJobDiff',
			async (jobHash?: JobHash) => {
				if (!jobHash || !jobHash[0] || !rootPath) return;
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
					const viewProps = await panelInstance.getViewDataForJob(
						jobHash,
					);
					if (!viewProps) {
						return;
					}
					panelInstance.setView({
						viewId: 'jobDiffView',
						viewProps: {
							data: [viewProps],
						},
					});
				} catch (err) {
					console.error(err);
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
					panelInstance.setView({
						viewId: 'jobDiffView',
						viewProps: {
							data: viewProps,
						},
					});
				} catch (err) {
					console.error(err);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openCaseByFolderDiff',
			async (arg0, ...otherArgs) => {
				const firstJobHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;
				if (firstJobHash === null || !rootPath) {
					return;
				}

				const jobHashes = [arg0].concat(otherArgs.slice());
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
					const viewProps =
						await panelInstance.getViewDataForJobsArray(jobHashes);

					if (!viewProps) {
						return;
					}
					panelInstance.setView({
						viewId: 'jobDiffView',
						viewProps: {
							data: viewProps,
						},
					});
				} catch (err) {
					console.error(err);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openFolderDiff',
			async (arg0, ...otherArgs) => {
				const firstJobHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;
				if (firstJobHash === null || !rootPath) {
					return;
				}

				const jobHashes = [arg0].concat(otherArgs.slice());
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
					const viewProps =
						await panelInstance.getViewDataForJobsArray(jobHashes);

					if (!viewProps) {
						return;
					}
					panelInstance.setView({
						viewId: 'jobDiffView',
						viewProps: {
							data: viewProps,
						},
					});
				} catch (err) {
					console.error(err);
				}
			},
		),
	);
	// @TODO split this large file to modules

	/**
	 * User
	 */
	const globalStateAccountStorage = new GlobalStateAccountStorage(
		context.globalState,
	);

	const userService = new UserService(globalStateAccountStorage, messageBus);

	const sourceControl = new SourceControlService(
		globalStateAccountStorage,
		messageBus,
	);

	const intuitaWebviewProvider = new IntuitaProvider(
		context,
		messageBus,
		jobManager,
		caseManager,
	);

	const viewExplorer = vscode.window.registerWebviewViewProvider(
		'intuitaMainWebviewExplorer',
		intuitaWebviewProvider,
	);
	context.subscriptions.push(viewExplorer);

	const view = vscode.window.registerWebviewViewProvider(
		'intuitaMainWebview',
		intuitaWebviewProvider,
	);

	context.subscriptions.push(view);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.createIssue', async (arg0) => {
			const treeItem = await treeDataProvider.getTreeItem(arg0);

			const initialData = {
				repositoryPath: repositoryService.getRemoteUrl(),
				userId: globalStateAccountStorage.getUserAccount(),
			};

			const { label } = treeItem;
			const title = typeof label === 'object' ? label.label : label ?? '';

			const panelInstance = SourceControlWebviewPanel.getInstance(
				{
					type: 'intuitaPanel',
					title,
					extensionUri: context.extensionUri,
					initialData,
					viewColumn: vscode.ViewColumn.One,
					webviewName: 'sourceControl',
				},
				messageBus,
			);

			await panelInstance.render();

			const remoteUrl = repositoryService.getRemoteUrl();

			if (remoteUrl === null) {
				throw new Error('Unable to detect the git remote URI');
			}

			const remotes = repositoryService.getRemotes();
			const remoteOptions = remotes
				.map(({ pushUrl }) => pushUrl)
				.filter(isNeitherNullNorUndefined);

			panelInstance.setView({
				viewId: 'createIssue',
				viewProps: {
					initialFormData: { title, body: '', remoteUrl },
					loading: false,
					error: '',
					remoteOptions,
				},
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.createPR', async (arg0) => {
			try {
				const caseHash = typeof arg0 === 'string' ? arg0 : null;

				if (caseHash === null) {
					throw new Error(
						`Could not decode the first positional arguments: it should have been a string`,
					);
				}

				if (!repositoryService) {
					throw new Error('Unable to initialize repositoryService');
				}

				const currentBranch = repositoryService.getCurrentBranch();

				if (!currentBranch) {
					throw new Error('Unable to get HEAD');
				}

				const hasChanges = repositoryService.hasChangesToCommit();

				if (!hasChanges) {
					throw new Error('Nothing to commit');
				}

				const theCase = caseManager.getCase(caseHash as CaseHash);

				if (!theCase) {
					throw new Error('Case not found');
				}

				const caseUniqueName = getCaseUniqueName(theCase);
				const targetBranchName =
					repositoryService.getBranchName(caseUniqueName);

				const baseBranchName =
					repositoryService.getStackedBranchBase(targetBranchName);

				if (!baseBranchName) {
					throw new Error('Unable to get the base branch');
				}

				const title = `${theCase.codemodSetName}: ${theCase.codemodName}`;
				const body = 'Add description';

				const initialData = {
					repositoryPath: repositoryService.getRemoteUrl(),
					userId: globalStateAccountStorage.getUserAccount(),
				};

				const panelInstance = SourceControlWebviewPanel.getInstance(
					{
						type: 'intuitaPanel',
						title,
						extensionUri: context.extensionUri,
						initialData,
						viewColumn: vscode.ViewColumn.One,
						webviewName: 'sourceControl',
					},
					messageBus,
				);

				await panelInstance.render();

				const remotes = repositoryService.getRemotes();
				const remoteOptions = (remotes ?? [])
					.map((remote) => remote.pushUrl)
					.filter(isNeitherNullNorUndefined);

				const defaultRemoteUrl = repositoryService.getRemoteUrl();

				if (!defaultRemoteUrl) {
					throw new Error('Remote not found');
				}

				const pullRequest = await sourceControl.getPRForBranch(
					targetBranchName,
					defaultRemoteUrl,
				);

				// @TODO need to check this each time use switches remote
				const pullRequestAlreadyExists = pullRequest !== null;

				panelInstance.setView({
					viewId: 'upsertPullRequest',
					viewProps: {
						// branching from current branch
						baseBranchOptions: [baseBranchName],
						targetBranchOptions: [targetBranchName],
						remoteOptions,
						initialFormData: {
							title,
							body,
							baseBranch: baseBranchName,
							targetBranch: targetBranchName,
							remoteUrl: defaultRemoteUrl,
						},
						loading: false,
						error: '',
						pullRequestAlreadyExists,
					},
				});
			} catch (e) {
				vscode.window.showErrorMessage((e as Error).message);
			}
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.user.unlinkIntuitaAccount',
			() => {
				userService.unlinkUserIntuitaAccount();
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
		vscode.commands.registerCommand(
			'intuita.sourceControl.createPR',
			async (arg0) => {
				try {
					if (!repositoryService) {
						throw new Error(
							'Unable to initialize repositoryService',
						);
					}
					const codec = buildTypeCodec({
						title: t.string,
						body: t.string,
						baseBranch: t.string,
						targetBranch: t.string,
						remoteUrl: t.string,
					});

					const decoded = codec.decode(arg0);

					if (decoded._tag === 'Right') {
						const remotes = repositoryService.getRemotes();
						const remote = (remotes ?? []).find(
							(remote) =>
								remote.pushUrl === decoded.right.remoteUrl,
						);

						if (!remote) {
							throw new Error('Remote not found');
						}

						await repositoryService.submitChanges(
							decoded.right.targetBranch,
							remote.name,
						);

						const existingPullRequest =
							await sourceControl.getPRForBranch(
								decoded.right.targetBranch,
								decoded.right.remoteUrl,
							);

						const { html_url } =
							existingPullRequest ??
							(await sourceControl.createPR(decoded.right));

						// save remote on success
						if (remote.pushUrl) {
							repositoryService.setRemoteUrl(remote.pushUrl);
							persistedStateService.saveExtensionState();
						}

						const messageSelection =
							await vscode.window.showInformationMessage(
								`Changes successfully submitted: ${html_url}`,
								'View on GitHub',
							);

						if (messageSelection === 'View on GitHub') {
							vscode.env.openExternal(vscode.Uri.parse(html_url));
						}
					}
				} catch (e) {
					const message =
						isAxiosError<{ message?: string }>(e) &&
						e.response?.data.message
							? e.response.data.message
							: e instanceof Error
							? e.message
							: String(e);
					vscode.window.showErrorMessage(message);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sourceControl.submitIssue',
			async (arg0) => {
				try {
					const codec = buildTypeCodec({
						title: t.string,
						body: t.string,
						remoteUrl: t.string,
					});

					const decoded = codec.decode(arg0);

					if (decoded._tag === 'Right') {
						// @TODO add ability to select remote for issues

						const { html_url } = await sourceControl.createIssue({
							...decoded.right,
						});

						// save remote on success
						if (decoded.right.remoteUrl) {
							repositoryService.setRemoteUrl(
								decoded.right.remoteUrl,
							);
							persistedStateService.saveExtensionState();
						}

						const messageSelection =
							await vscode.window.showInformationMessage(
								`Successfully created issue: ${html_url}`,
								'View on GitHub',
							);

						if (messageSelection === 'View on GitHub') {
							vscode.env.openExternal(vscode.Uri.parse(html_url));
						}
					}
				} catch (e) {
					if (e instanceof NotFoundRepositoryPath) {
						vscode.window.showInformationMessage(
							'Missing the repository path. Ensure your workspace is connected to a Git remote.',
						);
					}

					if (e instanceof NotFoundIntuitaAccount) {
						const result =
							await vscode.window.showInformationMessage(
								'Your extension is not currently connected to your Intuita account. Please sign in and connect your account to the extension to unlock additional features.',
								{ modal: true },
								'Sign In',
							);

						if (result === 'Sign In') {
							vscode.env.openExternal(
								vscode.Uri.parse('https://codemod.studio/'),
							);
						}
					}

					// @TODO create parseError helper or something like that
					const message =
						isAxiosError<{ message?: string }>(e) &&
						e.response?.data.message
							? e.response.data.message
							: e instanceof Error
							? e.message
							: String(e);

					vscode.window.showErrorMessage(message);
				}
			},
		),
	);

	vscode.window.onDidChangeActiveTextEditor(() => {
		handleActiveTextEditor();
	});
	vscode.workspace.onDidChangeTextDocument(() => {
		handleActiveTextEditor();
	});

	vscode.window.onDidChangeTextEditorSelection(() => {
		handleActiveTextEditor();
	});

	handleActiveTextEditor();

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.shutdownEngines', () => {
			engineService.shutdownEngines();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.executeCodemods', (arg0) => {
			const { storageUri } = context;

			if (!storageUri) {
				console.error('No storage URI, aborting the command.');
				return;
			}

			const codec = buildTypeCodec({
				path: t.string,
				dependencyName: t.string,
			});

			const validation = codec.decode(arg0);

			if (validation._tag === 'Left') {
				const report = prettyReporter.report(validation);

				console.error(report);

				return;
			}

			const { path, dependencyName } = validation.right;

			const uri = vscode.Uri.file(path);

			const recipeName = dependencyNameToRecipeName[dependencyName];

			if (!recipeName) {
				return;
			}

			const executionId = buildExecutionId();
			const happenedAt = String(Date.now());

			messageBus.publish({
				kind: MessageKind.executeCodemodSet,
				command: {
					engine: 'node',
					storageUri,
					uri,
					recipeName: recipeName,
				},
				executionId,
				happenedAt,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeNextJsCodemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'nextJs',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeNextJsExperimentalCodemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'next_13_composite',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executePagesToAppsCodemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'rust',
						storageUri,
						recipeName: 'nextJs',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeMuiCodemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'mui',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeReactRouterv4Codemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'reactrouterv4',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeReactRouterv6Codemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'reactrouterv6',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	vscode.commands.registerCommand(
		'intuita.executeImmutableJSv0Codemods',
		async (path?: vscode.Uri) => {
			const { storageUri } = context;

			if (!storageUri) {
				console.error('No storage URI, aborting the command.');
				return;
			}

			const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

			if (!uri) {
				console.warn(
					'No workspace folder is opened, aborting the operation.',
				);
				return;
			}

			const executionId = buildExecutionId();
			const happenedAt = String(Date.now());

			messageBus.publish({
				kind: MessageKind.executeCodemodSet,
				command: {
					engine: 'node',
					storageUri,
					recipeName: 'immutablejsv0',
					uri,
				},
				executionId,
				happenedAt,
			});
		},
	);
	vscode.commands.registerCommand(
		'intuita.runCodemod',
		async (item: CodemodHash) => {
			messageBus.publish({
				kind: MessageKind.runCodemod,
				codemodHash: item,
			});
		},
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeImmutableJSv4Codemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'immutablejsv4',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeRedwoodJsCore4Codemods',
			async (path?: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = path ?? vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!uri) {
					console.warn(
						'No workspace folder is opened, aborting the operation.',
					);
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						engine: 'node',
						storageUri,
						recipeName: 'redwoodjs_core_4',
						uri,
					},
					executionId,
					happenedAt,
				});
			},
		),
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
		vscode.commands.registerCommand('intuita.requestFeature', () => {
			vscode.env.openExternal(
				vscode.Uri.parse('https://feedback.intuita.io/'),
			);
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.openYouTubeChannel', () => {
			vscode.env.openExternal(
				vscode.Uri.parse(
					'https://www.youtube.com/channel/UCAORbHiie6y5yVaAUL-1nHA',
				),
			);
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.acceptJob',
			async (arg0: unknown) => {
				const jobHash = typeof arg0 === 'string' ? arg0 : null;

				if (jobHash === null) {
					throw new Error(
						`Could not decode the first positional arguments: it should have been a string`,
					);
				}

				messageBus.publish({
					kind: MessageKind.acceptJobs,
					jobHashes: new Set([jobHash as JobHash]),
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.rejectJob', async (arg0) => {
			const jobHash: string | null =
				typeof arg0 === 'string' ? arg0 : null;

			if (jobHash === null) {
				throw new Error('Did not pass the jobHash into the command.');
			}

			messageBus.publish({
				kind: MessageKind.rejectJobs,
				jobHashes: new Set([jobHash as JobHash]),
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.acceptCase', async (arg0) => {
			const caseHash: string | null =
				typeof arg0 === 'string' ? arg0 : null;

			if (caseHash === null) {
				throw new Error('Did not pass the caseHash into the command.');
			}

			const stackedBranchesEmpty =
				repositoryService.isStackedBranchesEmpty();
			const currentBranch = repositoryService.getCurrentBranch();

			if (!currentBranch?.name) {
				throw new Error('Unable to detect current branch');
			}

			if (stackedBranchesEmpty) {
				repositoryService.addStackedBranch(currentBranch.name);
			}

			/**
			 * checkout the branch before applying changes to the file system
			 */
			const theCase = caseManager.getCase(caseHash as CaseHash);

			if (!theCase) {
				throw new Error('Case not found');
			}

			const caseUniqueName = getCaseUniqueName(theCase);
			const branchName = repositoryService.getBranchName(caseUniqueName);
			await repositoryService.createOrCheckoutBranch(branchName);
			repositoryService.addStackedBranch(branchName);

			messageBus.publish({
				kind: MessageKind.acceptCase,
				caseHash: caseHash as CaseHash,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.rejectCase', async (arg0) => {
			const caseHash: string | null =
				typeof arg0 === 'string' ? arg0 : null;

			if (caseHash === null) {
				throw new Error('Did not pass the caseHash into the command.');
			}

			messageBus.publish({
				kind: MessageKind.rejectCase,
				caseHash: caseHash as CaseHash,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.acceptCaseByFolder',
			async (arg0, ...otherArgs) => {
				const firstJobHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;
				if (firstJobHash === null) {
					throw new Error(
						'Did not pass the jobHashes into the command.',
					);
				}
				const jobHashes = [arg0].concat(otherArgs.slice());

				messageBus.publish({
					kind: MessageKind.acceptJobs,
					jobHashes: new Set(jobHashes),
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.rejectCaseByFolder',
			async (arg0, ...otherArgs) => {
				const firstJobHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;
				if (firstJobHash === null) {
					throw new Error(
						'Did not pass the jobHashes into the command.',
					);
				}
				const jobHashes = [arg0].concat(otherArgs.slice());

				messageBus.publish({
					kind: MessageKind.rejectJobs,
					jobHashes: new Set(jobHashes),
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.acceptFolder',
			async (arg0, ...otherArgs) => {
				const firstJobHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;
				if (firstJobHash === null) {
					throw new Error(
						'Did not pass the jobHashes into the command.',
					);
				}
				const jobHashes = [arg0].concat(otherArgs.slice());

				messageBus.publish({
					kind: MessageKind.acceptJobs,
					jobHashes: new Set(jobHashes),
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.rejectFolder',
			async (arg0, ...otherArgs) => {
				const firstJobHash: string | null =
					typeof arg0 === 'string' ? arg0 : null;
				if (firstJobHash === null) {
					throw new Error(
						'Did not pass the jobHashes into the command.',
					);
				}
				const jobHashes = [arg0].concat(otherArgs.slice());

				messageBus.publish({
					kind: MessageKind.rejectJobs,
					jobHashes: new Set(jobHashes),
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.openTopLevelNodeKindOrderSetting',
			() => {
				return vscode.commands.executeCommand(
					'workbench.action.openSettings',
					'intuita.topLevelNodeKindOrder',
				);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeAsCodemod',
			(uri: vscode.Uri) => {
				const rootUri = vscode.workspace.workspaceFolders?.[0]?.uri;

				if (!rootUri) {
					throw new Error('No workspace has been opened.');
				}

				const { storageUri } = context;

				if (!storageUri) {
					throw new Error('No storage URI, aborting the command.');
				}

				const happenedAt = String(Date.now());
				const executionId = buildExecutionId();

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						uri: rootUri,
						engine: 'node',
						storageUri,
						fileUri: uri,
					},
					happenedAt,
					executionId,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeRecipeWithinPath',
			async (uri: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					throw new Error('No storage URI, aborting the command.');
				}

				const projectName = await vscode.window.showQuickPick(
					PROJECT_NAMES.slice(),
					{
						placeHolder:
							'Pick the project to execute a codemod set (recipe) over the selected path',
					},
				);

				if (!projectNameCodec.is(projectName)) {
					return;
				}

				const recipeMap = RECIPE_MAP.get(projectName);

				if (!recipeMap) {
					return;
				}

				let version = await vscode.window.showQuickPick(
					Object.keys(recipeMap).map((version) =>
						!isNaN(parseFloat(version)) ? `v${version}` : version,
					),
					{
						placeHolder:
							'Pick the codemod set (recipe) to execute over the selected path',
					},
				);

				if (!version) {
					return;
				}

				if (
					version.startsWith('v') &&
					!isNaN(parseFloat(version.slice(1)))
				) {
					version = version.slice(1);
				}

				const recipeName = recipeMap[version];

				if (!recipeNameCodec.is(recipeName)) {
					return;
				}

				const executionId = buildExecutionId();
				const happenedAt = String(Date.now());

				const command: Command =
					recipeName === 'redwoodjs_experimental'
						? {
								kind: 'repomod',
								engine: 'node',
								repomodFilePath: recipeName,
								storageUri,
								inputPath: uri,
						  }
						: {
								engine: 'node',
								storageUri,
								recipeName,
								uri,
						  };

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command,
					executionId,
					happenedAt,
				});
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeImportedModOnPath',
			async (uri: vscode.Uri) => {
				const { storageUri } = context;

				if (!storageUri) {
					throw new Error('No storage URI, aborting the command.');
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
					vscode.window.showWarningMessage(Messages.noImportedMod);
					return;
				}

				const buffer = Buffer.from(text);
				const content = new Uint8Array(buffer);
				vscode.workspace.fs.writeFile(modUri, content);

				const happenedAt = String(Date.now());
				const executionId = buildExecutionId();

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
						uri,
						engine: 'node',
						storageUri,
						fileUri: modUri,
					},
					happenedAt,
					executionId,
				});
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
		vscode.commands.registerCommand('intuita.caseBreakdown', () => {
			messageBus.publish({
				kind: MessageKind.caseBreakdown,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.folderBreakdown', () => {
			messageBus.publish({
				kind: MessageKind.folderBreakdown,
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
				const userId = searchParams.get('userId');

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
				}

				if (userId) {
					try {
						userService.linkUsersIntuitaAccount(userId);
					} catch (e) {
						if (e instanceof AlreadyLinkedError) {
							const result =
								await vscode.window.showInformationMessage(
									'It seems like your extension is already linked to another Intuita account. Would you like to link it to your new Intuita account instead?',
									{ modal: true },
									'Link account',
								);

							if (result === 'Link account') {
								userService.unlinkUserIntuitaAccount();
								userService.linkUsersIntuitaAccount(userId);
							}
						}
					}
				}
			},
		}),
	);

	messageBus.publish({
		kind: MessageKind.updateElements,
	});

	// const dependencyService = new DependencyService(messageBus);

	// dependencyService.showInformationMessagesAboutUpgrades();

	new InformationMessageService(messageBus, () => context.storageUri ?? null);

	{
		const codec = buildTypeCodec({ version: t.string });

		const validation = codec.decode(context.extension.packageJSON);
		const version =
			validation._tag === 'Right' ? validation.right.version : null;

		new TelemetryService(configurationContainer, messageBus, version);
	}

	messageBus.publish({
		kind: MessageKind.bootstrapEngines,
	});

	messageBus.publish({ kind: MessageKind.extensionActivated });
}

export function deactivate() {
	messageBus.publish({ kind: MessageKind.extensionDeactivated });
}
