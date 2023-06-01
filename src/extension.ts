import * as t from 'io-ts';
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
import {
	branchNameFromStr,
	buildTypeCodec,
	isNeitherNullNorUndefined,
} from './utilities';
import prettyReporter from 'io-ts-reporters';
import { buildExecutionId } from './telemetry/hashes';
import { TelemetryService } from './telemetry/telemetryService';
import { IntuitaTextDocumentContentProvider } from './components/textDocumentContentProvider';
import { GlobalStateAccountStorage } from './components/user/userAccountStorage';
import { AlreadyLinkedError, UserService } from './components/user/userService';
import {
	NotFoundIntuitaAccount,
	SourceControlService,
} from './components/sourceControl';
import { SourceControlWebviewPanel } from './components/webview/SourceControlWebviewPanel';
import { isAxiosError } from 'axios';
import { RepositoryService } from './components/webview/repository';
import { ElementHash } from './elements/types';

import type { GitExtension } from './types/git';
import { FileExplorerProvider } from './components/webview/FileExplorerProvider';
import { CampaignManagerProvider } from './components/webview/CampaignManagerProvider';
import { DiffWebviewPanel } from './components/webview/DiffWebviewPanel';
import {
	createIssueParamsCodec,
	createPullRequestParamsCodec,
	applyChangesCoded,
} from './components/sourceControl/codecs';
import { buildJobElementLabel } from './elements/buildJobElement';
import { CodemodListPanelProvider } from './components/webview/CodemodListProvider';
import { CodemodService } from './packageJsonAnalyzer/codemodService';
import { CodemodHash } from './packageJsonAnalyzer/types';
import { randomBytes } from 'crypto';
import { CommunityProvider } from './components/webview/CommunityProvider';
import { UserHooksService } from './components/hooks';
import { VscodeTelemetry } from './telemetry/vscodeTelemetry';
import { TextDocumentContentProvider } from './components/webview/VirtualDocumentProvider';

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

	const engineService = new EngineService(
		configurationContainer,
		messageBus,
		vscode.workspace.fs,
	);

	new BootstrapExecutablesService(
		downloadService,
		context.globalStorageUri,
		vscode.workspace.fs,
		messageBus,
	);

	const gitExtension =
		vscode.extensions.getExtension<GitExtension>('vscode.git');
	const activeGitExtension = gitExtension?.isActive
		? gitExtension.exports
		: await gitExtension?.activate();

	const git = activeGitExtension?.getAPI(1) ?? null;

	const repositoryService = new RepositoryService(
		git,
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

	const codemodService = new CodemodService(rootPath, engineService);

	const codemodListWebviewProvider = new CodemodListPanelProvider(
		context,
		messageBus,
		rootPath,
		codemodService,
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'intuita-available-codemod-tree-view',
			codemodListWebviewProvider,
		),
	);

	const telemetryKey = '61406ec7-5d8d-48e0-bf19-0cb1650bfb2c';
	const vscodeTelemetry = new VscodeTelemetry(
		new TelemetryReporter(telemetryKey),
		messageBus);
		
	const textContentProvider = new TextDocumentContentProvider(
		messageBus,
		engineService,
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
			async (arg0?: CodemodHash) => {
				try {
					const codemodHash = typeof arg0 === 'string' ? arg0 : null;

					if (codemodHash === null) {
						throw new Error(`Expected codemod hash, got ${arg0}`);
					}

					const uri = vscode.Uri.parse(
						`${CODEMOD_METADATA_SCHEME}:${codemodHash}.md`,
					);

					const hasMetadata = textContentProvider.hasMetadata(uri);

					if (!hasMetadata) {
						return;
					}

					vscode.commands.executeCommand('markdown.showPreview', uri);
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);
				}
			},
		));


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
					const message =
						err instanceof Error ? err.message : String(err);
					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.openCaseDiff',
						errorMessage: message,
					});
					console.error(err);
				}
			},
		),
	);

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
		repositoryService,
	);

	const fileExplorerProvider = new FileExplorerProvider(
		context,
		messageBus,
		jobManager,
		caseManager,
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

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.createIssue', async () => {
			try {
				const initialData = {
					userId: globalStateAccountStorage.getUserAccount(),
				};

				// @TODO
				const title = 'Label';

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
			} catch (e) {
				const message = e instanceof Error ? e.message : String(e);
				vscodeTelemetry.sendError({
					kind: 'failedToExecuteCommand',
					commandName: 'intuita.createIssue',
					errorMessage: message,
				});
			}
		}),
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
					fileExplorerProvider.focusNode();
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

	// @TODO reuse this in createPR
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sourceControl.commitChanges',
			async (arg0) => {
				try {
					const decoded = createPullRequestParamsCodec.decode(arg0);

					if (decoded._tag === 'Left') {
						throw new Error(
							prettyReporter.report(decoded).join('\n'),
						);
					}

					const { newBranchName, createNewBranch, commitMessage } =
						decoded.right;

					const remotes = repositoryService.getRemotes();
					const remote = (remotes ?? []).find(
						(remote) => remote.pushUrl === decoded.right.remoteUrl,
					);

					if (!remote || !remote.pushUrl) {
						throw new Error('Remote not found');
					}

					const currentBranch = repositoryService.getCurrentBranch();

					const currentBranchName = currentBranch?.name ?? null;

					if (currentBranchName === null) {
						throw new Error('Unable to get current branch');
					}

					await repositoryService.commitChanges(
						createNewBranch ? newBranchName : currentBranchName,
						commitMessage,
					);

					vscode.window.showInformationMessage(
						`Committed on branch ${currentBranchName}`,
					);

					messageBus.publish({
						kind: MessageKind.updateElements,
					});

					if (remote.pushUrl) {
						repositoryService.setRemoteUrl(remote.pushUrl);
						persistedStateService.saveExtensionState();
					}
				} catch (e) {
					const message =
						isAxiosError<{ message?: string }>(e) &&
						e.response?.data.message
							? e.response.data.message
							: e instanceof Error
							? e.message
							: String(e);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.sourceControl.commitChanges',
						errorMessage: message,
					});
					vscode.window.showErrorMessage(message);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sourceControl.createPR',
			async (arg0) => {
				try {
					const decoded = createPullRequestParamsCodec.decode(arg0);

					if (decoded._tag === 'Left') {
						throw new Error(
							prettyReporter.report(decoded).join('\n'),
						);
					}

					const {
						newBranchName,
						createNewBranch,
						commitMessage,
						pullRequestBody,
						pullRequestTitle,
					} = decoded.right;

					const remotes = repositoryService.getRemotes();
					const remote = (remotes ?? []).find(
						(remote) => remote.pushUrl === decoded.right.remoteUrl,
					);

					if (!remote || !remote.pushUrl) {
						throw new Error('Remote not found');
					}

					const currentBranch = repositoryService.getCurrentBranch();

					const currentBranchName = currentBranch?.name ?? null;

					if (currentBranchName === null) {
						throw new Error('Unable to get current branch');
					}

					if (!createNewBranch) {
						await repositoryService.submitChanges(
							currentBranchName,
							remote.name,
							commitMessage,
						);

						const branchUrl = `${remote.pushUrl}/tree/${currentBranchName}`;
						const messageSelection =
							await vscode.window.showInformationMessage(
								`Changes successfully pushed to the ${currentBranchName} branch: ${branchUrl}`,
								'View on GitHub',
							);

						if (messageSelection === 'View on GitHub') {
							vscode.env.openExternal(
								vscode.Uri.parse(branchUrl),
							);
						}
					} else {
						await repositoryService.submitChanges(
							newBranchName,
							remote.name,
							commitMessage,
						);
						const { html_url } = await sourceControl.createPR({
							title: pullRequestTitle,
							body: pullRequestBody,
							baseBranch: currentBranchName,
							targetBranch: newBranchName,
							remoteUrl: remote.pushUrl,
						});

						const messageSelection =
							await vscode.window.showInformationMessage(
								`Pull request successfully created: ${html_url}`,
								'View on GitHub',
							);

						if (messageSelection === 'View on GitHub') {
							vscode.env.openExternal(vscode.Uri.parse(html_url));
						}
					}

					messageBus.publish({
						kind: MessageKind.updateElements,
					});

					if (remote.pushUrl) {
						repositoryService.setRemoteUrl(remote.pushUrl);
						persistedStateService.saveExtensionState();
					}
				} catch (e) {
					const message =
						isAxiosError<{ message?: string }>(e) &&
						e.response?.data.message
							? e.response.data.message
							: e instanceof Error
							? e.message
							: String(e);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.sourceControl.createPR',
						errorMessage: message,
					});
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
					const decoded = createIssueParamsCodec.decode(arg0);

					if (decoded._tag === 'Right') {
						const params = decoded.right;

						const { html_url } = await sourceControl.createIssue(
							params,
						);
						const { remoteUrl } = params;

						repositoryService.setRemoteUrl(remoteUrl);

						persistedStateService.saveExtensionState();

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

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.sourceControl.submitIssue',
						errorMessage: message,
					});
					vscode.window.showErrorMessage(message);
				}
			},
		),
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
						errorMessage: message,
					});
					vscode.window.showErrorMessage(message);
				}
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.sourceControl.commitStagedJobs',
			async (arg0: unknown) => {
				try {
					const decoded = applyChangesCoded.decode(arg0);

					if (decoded._tag === 'Left') {
						throw new Error(
							prettyReporter.report(decoded).join('\n'),
						);
					}

					const currentBranch = repositoryService.getCurrentBranch();

					if (
						currentBranch === null ||
						currentBranch.name === undefined
					) {
						throw new Error('Unable to get current branch');
					}

					const { jobHashes: appliedJobsHashes } = decoded.right;
					const stagedJobs = [];

					for (const jobHash of appliedJobsHashes) {
						const job = jobManager.getJob(jobHash as JobHash);

						if (job === null) {
							continue;
						}

						stagedJobs.push({
							hash: job.hash.toString(),
							label: buildJobElementLabel(
								job,
								vscode.workspace.workspaceFolders?.[0]?.uri
									.path ?? '',
							),
							codemodName: job.codemodName,
						});
					}

					if (stagedJobs[0] === undefined) {
						throw new Error('Staged jobs not found');
					}

					const firstJobCodemodName = stagedJobs[0].codemodName;

					const newBranchName = branchNameFromStr(
						firstJobCodemodName + randomBytes(16).toString('hex'),
					);

					const initialData = {
						userId: globalStateAccountStorage.getUserAccount(),
					};

					const panelInstance = SourceControlWebviewPanel.getInstance(
						{
							type: 'intuitaPanel',
							title: firstJobCodemodName,
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

					panelInstance.setView({
						viewId: 'commitView',
						viewProps: {
							remoteOptions,
							initialFormData: {
								currentBranchName: currentBranch.name,
								newBranchName,
								remoteUrl: defaultRemoteUrl,
								commitMessage: `Codemod: ${firstJobCodemodName}`,
								createNewBranch: true,
								stagedJobs,
								pullRequestBody: '',
								pullRequestTitle: `[Codemod] ${firstJobCodemodName}`,
							},
							loading: false,
							error: '',
						},
					});
				} catch (e) {
					const message = e instanceof Error ? e.message : String(e);
					vscode.window.showErrorMessage(message);

					vscodeTelemetry.sendError({
						kind: 'failedToExecuteCommand',
						commandName: 'intuita.sourceControl.commitStagedJobs',
						errorMessage: message,
					});
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

				fileExplorerProvider.setView({
					viewId: 'treeView',
					viewProps: null,
				});
			} catch (e) {
				const message = e instanceof Error ? e.message : String(e);
				vscode.window.showErrorMessage(message);

				vscodeTelemetry.sendError({
					kind: 'failedToExecuteCommand',
					commandName: 'intuita.rejectCase',
					errorMessage: message,
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
				fileExplorerProvider.updateExplorerView(caseHash);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeAsCodemod',
			(uri: vscode.Uri) => {
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

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command: {
							uri: rootUri,
							storageUri,
							fileUri: uri,
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
						errorMessage: message,
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
						command = {
							kind: 'executeCodemod',
							storageUri,
							codemodHash: hashDigest,
							uri,
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
						errorMessage: message,
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

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command: {
							kind: 'executeCodemod',
							storageUri,
							codemodHash:
								selectedCodemod.hashDigest as CodemodHash,
							uri,
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
						errorMessage: message,
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

					messageBus.publish({
						kind: MessageKind.executeCodemodSet,
						command: {
							uri,
							storageUri,
							fileUri: modUri,
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
						errorMessage: message,
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
				const userId = searchParams.get('userId');
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
				} else if (userId) {
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

	messageBus.publish({
		kind: MessageKind.updateElements,
	});

	// const dependencyService = new DependencyService(messageBus);

	// dependencyService.showInformationMessagesAboutUpgrades();

	{
		const codec = buildTypeCodec({ version: t.string });

		const validation = codec.decode(context.extension.packageJSON);
		const version =
			validation._tag === 'Right' ? validation.right.version : null;

		new TelemetryService(configurationContainer, messageBus, version);
	}

	messageBus.publish({
		kind: MessageKind.bootstrapEngine,
	});

	messageBus.publish({ kind: MessageKind.extensionActivated });
}

export function deactivate() {
	messageBus.publish({ kind: MessageKind.extensionDeactivated });
}
