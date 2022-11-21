import * as vscode from 'vscode';
import { getConfiguration } from './configuration';
import { buildContainer } from './container';
import { IntuitaFileSystem } from './components/intuitaFileSystem';
import { MessageBus, MessageKind } from './components/messageBus';
import { IntuitaCodeActionProvider } from './components/intuitaCodeActionProvider';
import { JobManager } from './components/jobManager';
import { IntuitaTreeDataProvider } from './components/intuitaTreeDataProvider';
import { InferredCodeRepairService } from './components/inferredCodeRepairService';
import { DiagnosticManager } from './components/diagnosticManager';
import { RuleBasedCoreRepairService } from './components/ruleBasedCodeRepairService';
import { FileService } from './components/fileService';
import { VSCodeService } from './components/vscodeService';
import { JobHash } from './jobs/types';
import { CaseManager } from './cases/caseManager';
import { MoveTopLevelBlocksService } from './components/moveTopLevelNodeBlocksService';
import { CaseHash } from './cases/types';
import { PolyglotPiranhaRepairCodeService } from './components/polyglotPiranhaRepairCodeService';
import { FileSystemUtilities } from './components/fileSystemUtilities';

const messageBus = new MessageBus();

export async function activate(context: vscode.ExtensionContext) {
	const vscodeService: VSCodeService = {
		openTextDocument: async (uri) => vscode.workspace.openTextDocument(uri),
		getVisibleEditors: () => vscode.window.visibleTextEditors,
		getTextDocuments: () => vscode.workspace.textDocuments,
		getActiveTextEditor: () => vscode.window.activeTextEditor ?? null,
		getDiagnostics: () => vscode.languages.getDiagnostics(),
		getWorkspaceFolder: (uri) =>
			vscode.workspace.getWorkspaceFolder(uri) ?? null,
	};

	messageBus.setDisposables(context.subscriptions);

	const diagnosticCollection =
		vscode.languages.createDiagnosticCollection('typescript');

	const configurationContainer = buildContainer(getConfiguration());

	const diagnosticManager = new DiagnosticManager(messageBus, vscodeService);

	const intuitaFileSystem = new IntuitaFileSystem(messageBus);

	context.subscriptions.push(
		vscode.workspace.registerFileSystemProvider(
			'intuita',
			intuitaFileSystem,
			{
				isCaseSensitive: true,
			},
		),
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			configurationContainer.set(getConfiguration());
		}),
	);

	const jobManager = new JobManager(
		messageBus,
		intuitaFileSystem,
		vscodeService,
	);

	const caseManager = new CaseManager(messageBus);

	new InferredCodeRepairService(
		caseManager,
		configurationContainer,
		messageBus,
	);

	new RuleBasedCoreRepairService(
		caseManager,
		configurationContainer,
		messageBus,
	);

	const uriStringToVersionMap = new Map<string, number>();

	new FileService(
		configurationContainer,
		jobManager,
		messageBus,
		vscodeService,
		uriStringToVersionMap,
	);

	const treeDataProvider = new IntuitaTreeDataProvider(
		caseManager,
		configurationContainer,
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

	const moveTopLevelBlocksService = new MoveTopLevelBlocksService(
		caseManager,
		jobManager,
		messageBus,
		configurationContainer,
		vscodeService,
	);

	treeDataProvider.setReveal(explorerTreeView.reveal);

	context.subscriptions.push(explorerTreeView);
	context.subscriptions.push(intuitaTreeView);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new IntuitaCodeActionProvider(jobManager),
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.buildMoveTopLevelNodeJobs',
			() => {
				const document = vscode.window.activeTextEditor?.document;

				if (!document) {
					return;
				}

				moveTopLevelBlocksService.onBuildMoveTopLevelBlockCasesAndJobsCommand(
					document.uri,
					document.getText(),
					document.version,
					'onCommand',
				);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.buildCodeRepairJobs',
			async () => {
				await diagnosticManager.handleDiagnostics('onCommand');
			},
		),
	);

	const fileSystemUtilities = new FileSystemUtilities(vscode.workspace.fs);

	const polyglotPiranhaRepairCodeService =
		new PolyglotPiranhaRepairCodeService(
			vscode.workspace.fs,
			fileSystemUtilities,
			context.globalStorageUri,
			messageBus,
		);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.buildNextJsCodeRepairJobs',
			async () => {
				const { storageUri } = context;

				if (!storageUri) {
					return;
				}

				await polyglotPiranhaRepairCodeService.buildRepairCodeJobs(
					storageUri,
				);
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
		vscode.commands.registerCommand(
			'intuita.acceptJob',
			async (arg0: unknown, arg1: unknown) => {
				const jobHash = typeof arg0 === 'string' ? arg0 : null;

				if (jobHash === null) {
					throw new Error(
						`Could not decode the first positional arguments: it should have been a string`,
					);
				}

				const characterDifference = typeof arg1 === 'number' ? arg1 : 0;

				messageBus.publish({
					kind: MessageKind.acceptJobs,
					jobHash: jobHash as JobHash,
					characterDifference,
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
		vscode.workspace.onDidChangeTextDocument(async ({ document }) => {
			const { uri } = document;

			if (
				uri.scheme === 'vscode-userdata' ||
				(uri.scheme === 'file' && uri.path.includes('.vscode'))
			) {
				return;
			}

			if (uri.scheme === 'intuita' && uri.path.startsWith('/vfs/jobs/')) {
				await document.save();

				return;
			}

			messageBus.publish({
				kind: MessageKind.externalFileUpdated,
				uri,
			});
		}),
	);

	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument(async (document) => {
			const { uri } = document;

			if (
				uri.scheme === 'vscode-userdata' ||
				(uri.scheme === 'file' && uri.path.includes('.vscode'))
			) {
				return;
			}

			if (
				!configurationContainer.get().buildCodeRepairJobsOnDocumentSave
			) {
				return;
			}

			const version = uriStringToVersionMap.get(document.uri.toString());

			if (version !== null && version === document.version) {
				return;
			}

			await diagnosticManager.handleDiagnostics('didSave');
		}),
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
		vscode.commands.registerCommand(
			'intuita.showOrHideFileElements',
			() => {
				const configuration =
					vscode.workspace.getConfiguration('intuita');

				const showFileElements =
					configuration.get<boolean>('showFileElements') ?? false;

				configuration.update('showFileElements', !showFileElements);
			},
		),
	);

	context.subscriptions.push(diagnosticCollection);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
