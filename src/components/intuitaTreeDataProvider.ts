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

type ElementHash = string & { __type: 'ElementHash' };

type DiagnosticElement = Readonly<{
	hash: ElementHash,
	kind: 'DIAGNOSTIC';
	label: string;
	uri: Uri;
	jobHash: JobHash;
	fileName: string;
	range: IntuitaRange;
	job: MoveTopLevelNodeJob | RepairCodeJob;
}>;

type FileElement = Readonly<{
	hash: ElementHash,
	kind: 'FILE';
	label: string;
	children: ReadonlyArray<DiagnosticElement>;
}>;

type RootElement = Readonly<{
	hash: ElementHash,
	kind: 'ROOT';
	children: ReadonlyArray<FileElement>;
}>;

type Element =
	| RootElement
	| FileElement
	| DiagnosticElement;

export const buildElementHash = (
	element: Omit<FileElement, 'hash'> | Omit<DiagnosticElement, 'hash'>
): ElementHash => {
	if (element.kind === 'FILE') {
		const hash = buildHash(
			[
				element.kind,
				element.label,
			].join(',')
		);

		return hash as ElementHash;
	}

	const hash = buildHash(
		[
			element.kind,
			element.label,
			element.uri,
			element.jobHash,
			element.fileName,
			...element.range.map((r) => String(r))
		].join(',')
	)

	return hash as ElementHash;
}

export class IntuitaTreeDataProvider implements TreeDataProvider<ElementHash> {
	public readonly eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;
	protected readonly _elementMap = new Map<ElementHash, Element>();

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

	// public getParent(element: Element): ProviderResult<Element> {
	// 	// TODO implement!
	// 	return null;
	// }

	public getChildren(
		elementHash: ElementHash | undefined,
	): ProviderResult<ElementHash[]> {
		const element = this._elementMap.get((elementHash ?? '') as ElementHash);

		if (!element) {
			return [];
		}

		if (element.kind === 'DIAGNOSTIC') {
			return [];
		}

		return element.children.map((childElement) => childElement.hash);

		// if (element?.kind === 'DIAGNOSTIC') {
		// 	return [];
		// }

		// if (element?.kind === 'FILE') {
		// 	return element.children.slice();
		// }

		// const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		// const fileNames = new Set<string>(this._jobManager.getFileNames());

		// return Array.from(fileNames)
		// 	.map((fileName): Element | null => {
		// 		const uri = Uri.parse(fileName);
		// 		const label: string = fileName.replace(rootPath, '');

		// 		const fileNameHash = buildFileNameHash(fileName);

		// 		const jobs = this._jobManager.getFileJobs(fileNameHash);

		// 		const children: DiagnosticElement[] = jobs.map((job) => {
		// 			const hashlessElement: Omit<DiagnosticElement, 'hash'> = {
		// 				kind: 'DIAGNOSTIC' as const,
		// 				label: job.title,
		// 				fileName,
		// 				uri,
		// 				range: job.range,
		// 				jobHash: job.hash,
		// 				job,
		// 			}

		// 			const hash = buildElementHash(hashlessElement);

		// 			return {
		// 				...hashlessElement,
		// 				hash,
		// 			};
		// 		});

		// 		if (children.length === 0) {
		// 			return null;
		// 		}

		// 		const hashlessElement: Omit<FileElement, 'hash'> = {
		// 			kind: 'FILE' as const,
		// 			label,
		// 			children
		// 		};

		// 		const hash = buildElementHash(hashlessElement);

		// 		return {
		// 			...hashlessElement,
		// 			hash,
		// 		};
		// 	})
		// 	.filter(isNeitherNullNorUndefined);
	}

	public getTreeItem(elementHash: ElementHash): TreeItem | Thenable<TreeItem> {
		const element = this._elementMap.get(elementHash);

		if (!element) {
			throw new Error(`Could not find an element with hash ${elementHash}`);
		}

		if (element.kind === 'ROOT') {
			throw new Error(`Cannot get a tree item for the root element`);
		}

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

		// create the elements

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
