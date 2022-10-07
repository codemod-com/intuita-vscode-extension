import { join } from 'node:path';
import {
	commands,
	Diagnostic,
	DiagnosticCollection,
	DiagnosticSeverity,
	Event,
	EventEmitter,
	MarkdownString,
	Position,
	ProviderResult,
	Range,
	TreeDataProvider,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
	workspace,
} from 'vscode';
import { buildFileNameHash } from '../features/moveTopLevelNode/fileNameHash';
import { JobHash } from '../features/moveTopLevelNode/jobHash';
import {
	buildHash,
	IntuitaRange,
	isNeitherNullNorUndefined,
} from '../utilities';
import { JobManager } from './jobManager';
import { buildFileUri, buildJobUri } from './intuitaFileSystem';
import { Message, MessageBus, MessageKind } from './messageBus';
import { MoveTopLevelNodeJob } from '../features/moveTopLevelNode/job';
import { RepairCodeJob } from '../features/repairCode/job';

type Element =
	| Readonly<{
			kind: 'FILE';
			label: string;
			children: ReadonlyArray<Element>;
	  }>
	| Readonly<{
			kind: 'DIAGNOSTIC';
			label: string;
			uri: Uri;
			hash: JobHash;
			fileName: string;
			range: IntuitaRange;
			job: MoveTopLevelNodeJob | RepairCodeJob;
	  }>;

export class IntuitaTreeDataProvider implements TreeDataProvider<Element> {
	public readonly eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;

	public constructor(
		protected readonly _messageBus: MessageBus,
		protected readonly _jobManager: JobManager,
		protected readonly _diagnosticCollection: DiagnosticCollection,
	) {
		this.onDidChangeTreeData = this.eventEmitter.event;

		this._messageBus.subscribe((message) => {
			if (message.kind === MessageKind.updateInternalDiagnostics) {
				setImmediate(async () => {
					await this._setDiagnosticEntry(message);
				});
			}
		});
	}

	public getChildren(
		element: Element | undefined,
	): ProviderResult<Element[]> {
		if (element?.kind === 'DIAGNOSTIC') {
			return [];
		}

		if (element?.kind === 'FILE') {
			return element.children.slice();
		}

		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const fileNames = new Set<string>(this._jobManager.getFileNames());

		return Array.from(fileNames)
			.map((fileName) => {
				const uri = Uri.parse(fileName);
				const label: string = fileName.replace(rootPath, '');

				const fileNameHash = buildFileNameHash(fileName);

				const jobs = this._jobManager.getFileJobs(fileNameHash);

				const children: Element[] = jobs.map((job) => {
					return {
						kind: 'DIAGNOSTIC' as const,
						label: job.title,
						fileName,
						uri,
						range: job.range,
						hash: job.hash,
						job,
					};
				});

				if (children.length === 0) {
					return null;
				}

				return {
					kind: 'FILE' as const,
					label,
					children,
				};
			})
			.filter(isNeitherNullNorUndefined);
	}

	public getTreeItem(element: Element): TreeItem | Thenable<TreeItem> {
		const treeItem = new TreeItem(element.label);

		treeItem.id = buildHash(element.label);

		treeItem.collapsibleState =
			element.kind === 'FILE'
				? TreeItemCollapsibleState.Collapsed
				: TreeItemCollapsibleState.None;

		treeItem.iconPath = join(
			__filename,
			'..',
			'..',
			'resources',
			element.kind === 'FILE' ? 'ts2.svg' : 'bluelightbulb.svg',
		);

		if (element.kind === 'DIAGNOSTIC') {
			treeItem.contextValue = 'intuitaJob';

			const tooltip = new MarkdownString(
				'Adhere to the code organization rules [here](command:intuita.openTopLevelNodeKindOrderSetting)',
			);

			tooltip.isTrusted = true;

			treeItem.tooltip = tooltip;

			treeItem.command = {
				title: 'Diff View',
				command: 'vscode.diff',
				arguments: [
					buildFileUri(element.uri),
					buildJobUri(element.job),
					'Proposed change',
				],
			};
		}

		return treeItem;
	}

	protected async _setDiagnosticEntry(
		message: Message & { kind: MessageKind.updateInternalDiagnostics },
	) {
		const uri = Uri.parse(message.fileName);

		const jobs = this._jobManager.getFileJobs(buildFileNameHash(message.fileName));

		const diagnostics = jobs.map(({ kind, title, range: intuitaRange }) => {
			const startPosition = new Position(
				intuitaRange[0],
				intuitaRange[1],
			);

			const endPosition = new Position(intuitaRange[2], intuitaRange[3]);

			const vscodeRange = new Range(startPosition, endPosition);

			const diagnostic = new Diagnostic(
				vscodeRange,
				title,
				DiagnosticSeverity.Information,
			);

			diagnostic.code = kind.valueOf();
			diagnostic.source = 'intuita';

			return diagnostic;
		});

		this._diagnosticCollection.clear();

		this._diagnosticCollection.set(uri, diagnostics);

		this.eventEmitter.fire();

		if (message.showTheFirstJob && jobs[0]) {
			await commands.executeCommand(
				'vscode.diff',
				buildFileUri(uri),
				buildJobUri(jobs[0]),
				'Proposed change',
			);
		}
	}
}
