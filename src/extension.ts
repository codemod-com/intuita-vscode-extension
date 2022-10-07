import * as vscode from 'vscode';
import { getConfiguration } from './configuration';
import { buildContainer } from './container';
import { JobHash } from './features/moveTopLevelNode/jobHash';
import { IntuitaFileSystem } from './components/intuitaFileSystem';
import { MessageBus, MessageKind } from './components/messageBus';
import { IntuitaCodeActionProvider } from './components/intuitaCodeActionProvider';
import { JobManager } from './components/jobManager';
import { IntuitaTreeDataProvider } from './components/intuitaTreeDataProvider';
import { InferredCodeRepairService } from './components/inferredCodeRepairService';
import { acceptJob } from './components/acceptJob';
import { DiagnosticManager } from './components/diagnosticManager';
import { RuleBasedCoreRepairService } from './components/ruleBasedCodeRepairService';
import { FileService } from './components/fileService';
import { VSCodeService } from './components/vscodeService';

const messageBus = new MessageBus();

export async function activate(context: vscode.ExtensionContext) {
	const vscodeService: VSCodeService = {
		openTextDocument: async (uri) => vscode.workspace.openTextDocument(uri),
		getVisibleEditors: () => vscode.window.visibleTextEditors,
		getTextDocuments: () => vscode.workspace.textDocuments,
		getActiveTextEditor: () => vscode.window.activeTextEditor ?? null,
		showTextDocument: async (textDocument) =>
			vscode.window.showTextDocument(textDocument),
		getDiagnostics: () => vscode.languages.getDiagnostics(),
		getWorkspaceFolder: (uri) =>
			vscode.workspace.getWorkspaceFolder(uri) ?? null,
	};

	messageBus.setDisposables(context.subscriptions);

	const diagnosticCollection =
		vscode.languages.createDiagnosticCollection('typescript');

	const configurationContainer = buildContainer(getConfiguration());

	const diagnosticManager = new DiagnosticManager(messageBus, vscodeService);

	new InferredCodeRepairService(
		configurationContainer,
		messageBus,
		vscodeService,
	);

	new RuleBasedCoreRepairService(configurationContainer, messageBus);

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

	const jobManager = new JobManager(messageBus, configurationContainer);

	new FileService(
		configurationContainer,
		jobManager,
		messageBus,
		vscodeService,
	);

	const treeDataProvider = new IntuitaTreeDataProvider(
		messageBus,
		jobManager,
		diagnosticCollection,
	);

	const explorerTreeView = vscode.window.createTreeView(
		'explorerIntuitaViewId',
		{ treeDataProvider },
	);

	const intuitaTreeView = vscode.window.createTreeView('intuitaViewId', {
		treeDataProvider,
	});

	treeDataProvider.setReveal(intuitaTreeView.reveal);

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

				jobManager.buildMoveTopLevelNodeJobs(
					document.uri,
					document.getText(),
				);
			},
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'intuita.buildCodeRepairJobs',
			async () => {
				const uri =
					vscode.window.activeTextEditor?.document.uri ?? null;

				await diagnosticManager.handleDiagnostics(uri, 'onCommand');
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
			acceptJob(jobManager),
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.rejectJob', async (arg0) => {
			const jobHash: string | null =
				typeof arg0 === 'string' ? arg0 : null;

			if (jobHash === null) {
				throw new Error(
					`Did not pass the element argument "${jobHash}".`,
				);
			}

			jobManager.rejectJob(jobHash as JobHash);
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

			if (uri.scheme === 'intuita' && uri.path.startsWith('/vfs/jobs/')) {
				await document.save();

				return;
			}

			messageBus.publish({
				kind: MessageKind.textDocumentChanged,
				uri,
			});
		}),
	);

	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument(async (document) => {
			if (
				!configurationContainer.get().buildCodeRepairJobsOnDocumentSave
			) {
				return;
			}

			await diagnosticManager.handleDiagnostics(document.uri, 'didSave');
		}),
	);

	context.subscriptions.push(diagnosticCollection);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
