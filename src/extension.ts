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
import { InternalService } from './components/internalService';

const messageBus = new MessageBus();

export async function activate(context: vscode.ExtensionContext) {
	messageBus.setDisposables(context.subscriptions);

	const diagnosticCollection =
		vscode.languages.createDiagnosticCollection('typescript');

	const configurationContainer = buildContainer(getConfiguration());

	const diagnosticManager = new DiagnosticManager(
		() => vscode.window.activeTextEditor ?? null,
		(uri) => vscode.languages.getDiagnostics(uri),
		messageBus,
	);

	new InferredCodeRepairService(
		configurationContainer,
		(uri) => vscode.workspace.getWorkspaceFolder(uri) ?? null,
		messageBus,
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

	new InternalService(
		jobManager,
		messageBus,
		async (uri) => vscode.workspace.openTextDocument(uri),
	);

	const treeDataProvider = new IntuitaTreeDataProvider(
		messageBus,
		jobManager,
		diagnosticCollection,
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'explorerIntuitaViewId',
			treeDataProvider,
		),
	);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'intuitaViewId',
			treeDataProvider,
		),
	);

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

				jobManager.buildMoveTopLevelNodeJobs(document);
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
			acceptJob(configurationContainer, intuitaFileSystem, jobManager),
		),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('intuita.rejectJob', async (args) => {
			const jobHash: string | null =
				typeof args === 'object' && typeof args.hash === 'string'
					? args.hash
					: null;

			if (jobHash === null) {
				throw new Error('Did not pass the job hash argument "hash".');
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

	context.subscriptions.push(diagnosticCollection);

	context.subscriptions.push(
		vscode.languages.onDidChangeDiagnostics((event) => {
			diagnosticManager.onDiagnosticChangeEvent(event);
		}),
	);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
