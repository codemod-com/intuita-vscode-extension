import * as vscode from 'vscode';
import {
	Diagnostic,
	DiagnosticSeverity,
	Position,
	Range,
} from 'vscode';
import {getConfiguration} from './configuration';
import { buildContainer } from "./container";
import { JobHash } from './features/moveTopLevelNode/jobHash';
import { IntuitaFileSystem } from './fileSystems/intuitaFileSystem';
import { MessageBus, MessageKind } from './messageBus';
import { buildDidChangeDiagnosticsCallback } from './languages/buildDidChangeDiagnosticsCallback';
import { buildTreeDataProvider } from './treeDataProviders';
import {buildMoveTopLevelNodeCommand} from "./commands/moveTopLevelNodeCommand";
import {OnnxWrapper} from "./components/onnxWrapper";
import { buildFileNameHash } from './features/moveTopLevelNode/fileNameHash';
import {IntuitaCodeActionProvider} from "./components/intuitaCodeActionProvider";
import {JobManager} from "./components/jobManager";

export async function activate(
	context: vscode.ExtensionContext,
) {
	const messageBus = new MessageBus(context.subscriptions);
	const onnxWrapper = new OnnxWrapper(messageBus);

	const configurationContainer = buildContainer(
		getConfiguration()
	);

	const intuitaFileSystem = new IntuitaFileSystem(
		messageBus,
	);

	context.subscriptions.push(
		vscode.workspace.registerFileSystemProvider(
			'intuita',
			intuitaFileSystem,
			{
				isCaseSensitive: true
			}
		),
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

	const jobManager = new JobManager(
		messageBus,
		configurationContainer,
		_setDiagnosticEntry,
	);

	const treeDataProvider = buildTreeDataProvider(
		jobManager,
	);

	function _setDiagnosticEntry(
		fileName: string,
	) {
		const uri = vscode.Uri.parse(fileName);

		const jobs = jobManager.getFileJobs(buildFileNameHash(fileName));

		const diagnostics = jobs
			.map(
				({ kind, title, range: intuitaRange }) => {
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

					const diagnostic = new Diagnostic(
						range,
						title,
						DiagnosticSeverity.Information
					);

					diagnostic.code = kind.valueOf();
					diagnostic.source = 'intuita';

					return diagnostic;
				}
			);

		diagnosticCollection.clear();

		diagnosticCollection.set(
			uri,
			diagnostics,
		);

		treeDataProvider._onDidChangeTreeData.fire();
	}

	messageBus.subscribe(
		(message) => {
			if (message.kind === MessageKind.readingFileFailed) {
				setImmediate(
					() => jobManager.onReadingFileFailed(
						message.uri,
					),
				);
			}
		},
	);

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

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			'typescript',
			new IntuitaCodeActionProvider(
				jobManager,
			)
		));


	const activeTextEditorChangedCallback = (
		document: vscode.TextDocument,
	) => {
		jobManager
			.onFileTextChanged(
				document,
			);
	};

	if (vscode.window.activeTextEditor) {
		activeTextEditorChangedCallback(
			vscode
				.window
				.activeTextEditor
				.document,
		);
	}

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(
			(textEditor) => {
				if (!textEditor) {
					return;
				}

				return activeTextEditorChangedCallback(
					textEditor
						.document,
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
			buildMoveTopLevelNodeCommand(
				configurationContainer,
				intuitaFileSystem,
				jobManager,
			),
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

				jobManager.rejectJob(
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
		vscode.workspace.onDidChangeTextDocument(
			async ({ document })=> {
				const { uri } = document;

				if (uri.scheme === 'intuita' && uri.path.startsWith('/jobs/')) {
					await document.save();

					return;
				}

				jobManager
					.onFileTextChanged(
						document,
					);
			})
		);

	context.subscriptions.push(diagnosticCollection);

	context.subscriptions.push(
		vscode.languages.onDidChangeDiagnostics(
			buildDidChangeDiagnosticsCallback(
				onnxWrapper,
			),
		),
	);
}

export function deactivate() {
	// TODO check if we need to kill the ONNX wrapper process here
}
