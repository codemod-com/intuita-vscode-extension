import * as t from 'io-ts';
import * as vscode from 'vscode';
import { getConfiguration } from './configuration';
import { buildContainer } from './container';
import { MessageBus, MessageKind } from './components/messageBus';
import { JobManager } from './components/jobManager';
import { IntuitaTreeDataProvider } from './components/intuitaTreeDataProvider';
import { FileService } from './components/fileService';
import { JobHash } from './jobs/types';
import { CaseManager } from './cases/caseManager';
import { CaseHash } from './cases/types';
import { DownloadService } from './components/downloadService';
import { FileSystemUtilities } from './components/fileSystemUtilities';
import { NoraCompareServiceEngine } from './components/noraCompareServiceEngine';
import { EngineService } from './components/engineService';
import { BootstrapExecutablesService } from './components/bootstrapExecutablesService';
import { StatusBarItemManager } from './components/statusBarItemManager';
import { PersistedStateService } from './persistedState/persistedStateService';
import { getPersistedState } from './persistedState/getPersistedState';
import {
	mapPersistedCaseToCase,
	mapPersistedJobToJob,
} from './persistedState/mappers';
// import { DependencyService } from './dependencies/dependencyService';
import {
	dependencyNameToGroup,
	InformationMessageService,
} from './components/informationMessageService';
import { buildTypeCodec } from './utilities';
import prettyReporter from 'io-ts-reporters';
import { buildExecutionId } from './telemetry/hashes';
import { TelemetryService } from './telemetry/telemetryService';

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
		new Set((persistedState?.rejectedJobHashes ?? []) as JobHash[]),
		messageBus,
	);

	const caseManager = new CaseManager(
		persistedState?.cases.map((kase) => mapPersistedCaseToCase(kase)) ?? [],
		new Set(persistedState?.caseHashJobHashes),
		messageBus,
	);

	new FileService(messageBus);

	const treeDataProvider = new IntuitaTreeDataProvider(
		caseManager,
		messageBus,
		jobManager,
	);

	const explorerTreeView = vscode.window.createTreeView(
		'explorerIntuitaViewId',
		{ treeDataProvider },
	);

	const intuitaTreeView = vscode.window.createTreeView('intuitaViewId', {
		treeDataProvider,
	});

	treeDataProvider.setReveal(explorerTreeView.reveal);

	context.subscriptions.push(explorerTreeView);
	context.subscriptions.push(intuitaTreeView);

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

	new PersistedStateService(
		caseManager,
		vscode.workspace.fs,
		() => context.storageUri ?? null,
		jobManager,
		messageBus,
	);

	const textEditorDecorationType =
		vscode.window.createTextEditorDecorationType({
			rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
		});

	const dependencies = ['next', '@material-ui/core'];

	const handleActiveTextEditor = (editor: vscode.TextEditor) => {
		const { document } = editor;

		if (!document.uri.fsPath.endsWith('package.json')) {
			return;
		}

		const uri = vscode.Uri.joinPath(document.uri, '..');
		const path = encodeURIComponent(uri.fsPath);

		const ranges: [string, vscode.Range][] = [];

		for (let i = 0; i < document.lineCount; i++) {
			const textLine = document.lineAt(i);

			for (const dependency of dependencies) {
				if (textLine.text.includes(`"${dependency}"`)) {
					ranges.push([dependency, textLine.range]);
				}
			}
		}

		const rangesOrOptions: vscode.DecorationOptions[] = ranges.map(
			([dependencyName, range]) => {
				const args = {
					path,
					dependencyName,
				};

				const commandUri = vscode.Uri.parse(
					`command:intuita.executeCodemods?${encodeURIComponent(
						JSON.stringify(args),
					)}`,
				);

				const hoverMessage = new vscode.MarkdownString(
					`[Execute "${dependencyName}" codemods](${commandUri})`,
				);
				hoverMessage.isTrusted = true;
				hoverMessage.supportHtml = true;

				return {
					range,
					hoverMessage,
					renderOptions: {
						after: {
							color: 'gray',
							contentText: `Hover over to upgrade your codebase to the latest version of "${dependencyName}"`,
							margin: '2em',
							fontStyle: 'italic',
						},
					},
				};
			},
		);

		editor.setDecorations(textEditorDecorationType, rangesOrOptions);
	};

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor) {
			handleActiveTextEditor(editor);
		}
	});

	vscode.workspace.onDidChangeTextDocument(() => {
		if (vscode.window.activeTextEditor) {
			handleActiveTextEditor(vscode.window.activeTextEditor);
		}
	});

	if (vscode.window.activeTextEditor) {
		handleActiveTextEditor(vscode.window.activeTextEditor);
	}

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

			const group = dependencyNameToGroup[dependencyName];

			if (!group) {
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
					group,
				},
				executionId,
				happenedAt,
			});
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeNextJsCodemods',
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
						group: 'nextJs',
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
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
						group: 'nextJs',
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
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
						group: 'mui',
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
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
						group: 'reactrouterv4',
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
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
						group: 'reactrouterv6',
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
		async () => {
			const { storageUri } = context;

			if (!storageUri) {
				console.error('No storage URI, aborting the command.');
				return;
			}

			const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
					group: 'immutablejsv0',
					uri,
				},
				executionId,
				happenedAt,
			});
		},
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.executeImmutableJSv4Codemods',
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const uri = vscode.workspace.workspaceFolders?.[0]?.uri;

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
						group: 'immutablejsv4',
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
				const { storageUri } = context;

				if (!storageUri) {
					console.error('No storage URI, aborting the command.');
					return;
				}

				const happenedAt = String(Date.now());
				const executionId = buildExecutionId();

				messageBus.publish({
					kind: MessageKind.executeCodemodSet,
					command: {
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
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (!event.affectsConfiguration('intuita')) {
				return;
			}

			messageBus.publish({
				kind: MessageKind.updateElements,
				trigger: 'onDidUpdateConfiguration',
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

	messageBus.publish({
		kind: MessageKind.updateElements,
		trigger: 'bootstrap',
	});

	// const dependencyService = new DependencyService(messageBus);

	// dependencyService.showInformationMessagesAboutUpgrades();

	new InformationMessageService(messageBus, () => context.storageUri ?? null);

	new TelemetryService(configurationContainer, messageBus);

	messageBus.publish({
		kind: MessageKind.bootstrapEngines,
	});

	messageBus.publish({ kind: MessageKind.extensionActivated });
}

export function deactivate() {
	messageBus.publish({ kind: MessageKind.extensionDeactivated });
}
