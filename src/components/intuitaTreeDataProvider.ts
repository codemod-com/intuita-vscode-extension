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
	TreeView,
	Uri,
	window,
	workspace,
} from 'vscode';
import { buildFileNameHash } from '../features/moveTopLevelNode/fileNameHash';
import { JobHash } from '../features/moveTopLevelNode/jobHash';
import { buildHash, IntuitaRange } from '../utilities';
import { JobManager } from './jobManager';
import { buildFileUri, buildJobUri } from './intuitaFileSystem';
import { Message, MessageBus, MessageKind } from './messageBus';
import { MoveTopLevelNodeJob } from '../features/moveTopLevelNode/job';
import { RepairCodeJob } from '../features/repairCode/job';

const buildDiagnostic = ({
	kind,
	title,
	range: intuitaRange,
}: MoveTopLevelNodeJob | RepairCodeJob): Diagnostic => {
	const startPosition = new Position(intuitaRange[0], intuitaRange[1]);

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
};

type ElementHash = string & { __type: 'ElementHash' };

type DiagnosticElement = Readonly<{
	hash: ElementHash;
	kind: 'DIAGNOSTIC';
	label: string;
	uri: Uri;
	jobHash: JobHash;
	fileName: string;
	range: IntuitaRange;
	job: MoveTopLevelNodeJob | RepairCodeJob;
}>;

type FileElement = Readonly<{
	hash: ElementHash;
	kind: 'FILE';
	label: string;
	children: ReadonlyArray<DiagnosticElement>;
}>;

type RootElement = Readonly<{
	hash: ElementHash;
	kind: 'ROOT';
	children: ReadonlyArray<FileElement>;
}>;

type Element = RootElement | FileElement | DiagnosticElement;

export const buildElementHash = (
	element: Omit<FileElement, 'hash'> | Omit<DiagnosticElement, 'hash'>,
): ElementHash => {
	if (element.kind === 'FILE') {
		const hash = buildHash([element.kind, element.label].join(','));

		return hash as ElementHash;
	}

	const hash = element.jobHash;

	return hash as unknown as ElementHash;
};

const buildDiagnosticElement = (
	job: MoveTopLevelNodeJob | RepairCodeJob,
): DiagnosticElement => {
	const hashlessElement: Omit<DiagnosticElement, 'hash'> = {
		kind: 'DIAGNOSTIC' as const,
		label: job.title,
		fileName: job.fileName,
		uri: Uri.parse(job.fileName),
		range: job.range,
		jobHash: job.hash,
		job,
	};

	const hash = buildElementHash(hashlessElement);

	return {
		...hashlessElement,
		hash,
	};
};

const buildFileElement = (
	label: string,
	children: ReadonlyArray<DiagnosticElement>,
): FileElement => {
	const hashlessElement: Omit<FileElement, 'hash'> = {
		kind: 'FILE' as const,
		label,
		children,
	};

	const hash = buildElementHash(hashlessElement);

	return {
		...hashlessElement,
		hash,
	};
};

const ROOT_ELEMENT_HASH: ElementHash = '' as ElementHash;

const buildRootElement = (
	oldRootElement: Element | null,
	action:
		| { kind: 'upsert'; fileElement: FileElement }
		| { kind: 'delete'; label: string },
): RootElement => {
	if (oldRootElement === null || oldRootElement.kind !== 'ROOT') {
		const children = action.kind === 'upsert' ? [action.fileElement] : [];

		return {
			hash: ROOT_ELEMENT_HASH,
			kind: 'ROOT',
			children,
		};
	}

	if (action.kind === 'delete') {
		const children = oldRootElement.children.filter((childFileElement) => {
			return childFileElement.label !== action.label;
		});

		return {
			hash: ROOT_ELEMENT_HASH,
			kind: 'ROOT',
			children,
		};
	}

	const index = oldRootElement.children.findIndex(
		(childFileElement) =>
			childFileElement.label === action.fileElement.label,
	);

	const children =
		index === -1
			? [...oldRootElement.children, action.fileElement]
			: oldRootElement.children.map((childFileElement) => {
					if (childFileElement.label === action.fileElement.label) {
						return action.fileElement;
					}

					return childFileElement;
			  });

	return {
		hash: ROOT_ELEMENT_HASH,
		kind: 'ROOT',
		children,
	};
};

export class IntuitaTreeDataProvider implements TreeDataProvider<ElementHash> {
	public readonly eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;
	protected readonly _elementMap = new Map<ElementHash, Element>();
	protected readonly _childParentMap = new Map<ElementHash, ElementHash>();
	protected _reveal: TreeView<ElementHash>['reveal'] | null = null;

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

	public setReveal(reveal: TreeView<ElementHash>['reveal']) {
		this._reveal = reveal;
	}

	public getParent(elementHash: ElementHash): ProviderResult<ElementHash> {
		return this._childParentMap.get(elementHash);
	}

	public getChildren(
		elementHash: ElementHash | undefined,
	): ProviderResult<ElementHash[]> {
		const element = this._elementMap.get(
			(elementHash ?? '') as ElementHash,
		);

		if (!element || element.kind === 'DIAGNOSTIC') {
			return [];
		}

		return element.children.map((childElement) => childElement.hash);
	}

	public getTreeItem(
		elementHash: ElementHash,
	): TreeItem | Thenable<TreeItem> {
		const element = this._elementMap.get(elementHash);

		if (!element) {
			throw new Error(
				`Could not find an element with hash ${elementHash}`,
			);
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
		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const label: string = message.fileName.replace(rootPath, '');

		const jobs = this._jobManager.getFileJobs(
			buildFileNameHash(message.fileName),
		);

		const diagnostics = jobs.map((job) => buildDiagnostic(job));

		const children: DiagnosticElement[] = jobs.map((job) =>
			buildDiagnosticElement(job),
		);

		const action =
			children.length === 0
				? { kind: 'delete' as const, label }
				: {
						kind: 'upsert' as const,
						fileElement: buildFileElement(label, children),
				  };

		const rootElement = buildRootElement(
			this._elementMap.get(ROOT_ELEMENT_HASH) ?? null,
			action,
		);

		// update collections
		this._diagnosticCollection.clear();
		this._diagnosticCollection.set(uri, diagnostics);

		this._childParentMap.clear();

		this._elementMap.clear();
		this._elementMap.set(rootElement.hash, rootElement);

		rootElement.children.forEach((fileElement) => {
			this._elementMap.set(fileElement.hash, fileElement);

			fileElement.children.forEach((diagnosticElement) => {
				this._elementMap.set(diagnosticElement.hash, diagnosticElement);
				this._childParentMap.set(
					diagnosticElement.hash,
					fileElement.hash,
				);
			});
		});

		// update the UX state
		this.eventEmitter.fire();

		if (!message.showTheFirstJob || !jobs[0]) {
			return;
		}

		const job = jobs[0];
		const diagnosticElement = buildDiagnosticElement(job);

		const showTheFirstJob = async () => {
			await commands.executeCommand(
				'vscode.diff',
				buildFileUri(uri),
				buildJobUri(job),
				'Proposed change',
			);

			if (!this._reveal) {
				return;
			}

			await this._reveal(diagnosticElement.hash, {
				select: true,
				focus: true,
			});
		};

		if (message.trigger === 'didSave') {
			window
				.showInformationMessage(
					`Generated ${jobs.length} core-repair recommendations`,
					'Show the first recommendation',
				)
				.then(async (response) => {
					if (!response) {
						return;
					}

					await showTheFirstJob();
				});

			return;
		}

		setImmediate(showTheFirstJob);
	}
}
