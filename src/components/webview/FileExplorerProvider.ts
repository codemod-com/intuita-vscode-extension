import {
	WebviewViewProvider,
	WebviewView,
	Uri,
	ExtensionContext,
	workspace,
	commands,
} from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import {
	TreeNode,
	View,
	WebviewMessage,
	WebviewResponse,
} from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import {
	CaseElement,
	Element,
	ElementHash,
	ElementKind,
	FileElement,
} from '../../elements/types';
import { Job, JobHash, JobKind } from '../../jobs/types';
import { buildHash, debounce, getElementIconBaseName } from '../../utilities';
import { JobManager } from '../jobManager';
import { CaseWithJobHashes } from '../../cases/types';
import {
	buildJobElement,
	compareJobElements,
} from '../../elements/buildJobElement';
import {
	buildFileElement,
	compareFileElements,
} from '../../elements/buildFileElement';
import {
	buildCaseElement,
	compareCaseElements,
} from '../../elements/buildCaseElement';
import { CaseManager } from '../../cases/caseManager';
import { SourceControlService } from '../sourceControl';

export class FileExplorerProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__elementMap = new Map<ElementHash, Element>();
	__folderMap = new Map<string, TreeNode>();
	__unsavedChanges = false;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		private readonly __sourceControl: SourceControlService,
	) {
		this.__extensionPath = context.extensionUri;

		this.__webviewResolver = new WebviewResolver(this.__extensionPath);
	}

	refresh(): void {
		if (!this.__view) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			this.__view.webview,
			'main',
			'{}',
		);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) return;

		this.__webviewResolver?.resolveWebview(
			webviewView.webview,
			'main',
			'{}',
		);
		this.__view = webviewView;

		this.__view.onDidChangeVisibility(() => {
			this.__onUpdateElementsMessage();
		});

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	private __postMessage(message: WebviewMessage) {
		if (!this.__view) {
			return;
		}

		this.__view.webview.postMessage(message);
	}

	private __getTreeByDirectory = (element: Element): TreeNode | undefined => {
		if (element.kind === ElementKind.CASE) {
			const repoName =
				workspace.workspaceFolders?.[0]?.uri.fsPath
					.split('/')
					.slice(-1)[0] ?? '/';
			this.__folderMap.set(repoName, {
				id: repoName,
				label: repoName,
				kind: 'folderElement',
				iconName: 'folder.svg',
				children: [],
			});
			element.children.forEach(this.__getTreeByDirectory);
			const treeNode = this.__folderMap.get(repoName) ?? undefined;

			return treeNode;
		}

		if (element.kind === ElementKind.FILE) {
			// e.g., extract the path from '/packages/app/src/index.tsx (1)'
			const filePath = element.label.split(' ')[0];
			if (!filePath) {
				return;
			}

			// e.g., ['packages', 'app', 'src', 'index.tsx']
			const directories = filePath
				.split('/')
				.filter((item) => item !== '');
			const fileName = directories[directories.length - 1];
			const repoName =
				workspace.workspaceFolders?.[0]?.uri.fsPath
					.split('/')
					.slice(-1)[0] ?? '/';
			let path = repoName;
			const newJobHashes = element.children.map((job) => job.jobHash);
			for (const dir of directories) {
				const parentNode = this.__folderMap.get(path) ?? null;

				if (parentNode === null) {
					return;
				}

				path += `/${dir}`;
				if (!this.__folderMap.has(path)) {
					const jobHashesArg: JobHash[] = [];
					const newTreeNode: TreeNode =
						dir === fileName
							? {
									id: path,
									kind: 'fileElement',
									iconName: getElementIconBaseName(
										ElementKind.FILE,
									),
									children: [],
									command: {
										title: 'Diff View',
										command: 'intuita.openJobDiff',
										arguments: jobHashesArg,
									},
									actions: [
										{
											title: '✗ Dismiss',
											command: 'intuita.rejectJob',
											arguments: jobHashesArg,
										},
									],
							  }
							: {
									id: path,
									kind: 'folderElement',
									iconName: 'folder.svg',
									children: [],
									command: {
										title: 'Diff View',
										command: 'intuita.openFolderDiff',
										arguments: jobHashesArg,
									},
									actions: [
										{
											title: '✓ Commit',
											command: 'intuita.acceptFolder',
											arguments: [
												{
													path,
													hash: buildHash(path),
													jobHashes: jobHashesArg,
												},
											],
										},
										{
											title: '✗ Dismiss',
											command: 'intuita.rejectFolder',
											arguments: jobHashesArg,
										},
									],
							  };

					this.__folderMap.set(path, newTreeNode);

					parentNode.children.push(newTreeNode);
				}
				const currentNode = this.__folderMap.get(path) ?? null;

				if (currentNode === null || !currentNode.command?.arguments) {
					// node must exist because we create it above if it doesn't
					continue;
				}

				const existingJobHashes = currentNode.command.arguments;
				newJobHashes.forEach((jobHash) => {
					if (!existingJobHashes.includes(jobHash)) {
						existingJobHashes.push(jobHash);
					}
				});
				currentNode.label = `${dir} (${existingJobHashes.length})`;
			}
		}

		return;
	};

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		this.__messageBus.subscribe<T>(kind, handler);
	}

	private __buildJobMap(
		casesWithJobHashes: Iterable<CaseWithJobHashes>,
	): ReadonlyMap<JobHash, Job> {
		const map = new Map<JobHash, Job>();

		for (const kase of casesWithJobHashes) {
			for (const jobHash of kase.jobHashes) {
				const job = this.__jobManager.getJob(jobHash);

				if (!job) {
					continue;
				}

				map.set(job.hash, job);
			}
		}

		return map;
	}

	__buildCaseElementsAndLatestJob(
		rootPath: string,
		casesWithJobHashes: Iterable<CaseWithJobHashes>,
		jobMap: ReadonlyMap<JobHash, Job>,
	): [ReadonlyArray<CaseElement>, Job | null] {
		let latestJob: Job | null = null;

		const unsortedCaseElements: CaseElement[] = [];

		for (const caseWithJobHashes of casesWithJobHashes) {
			const jobs: Job[] = [];

			for (const jobHash of caseWithJobHashes.jobHashes) {
				const job = jobMap.get(jobHash);

				if (job === undefined) {
					continue;
				}

				jobs.push(job);

				if (latestJob === null || latestJob.createdAt < job.createdAt) {
					latestJob = job;
				}
			}

			const uriSet = new Set<Uri>();

			for (const job of jobs) {
				if (
					[
						JobKind.createFile,
						JobKind.moveFile,
						JobKind.moveAndRewriteFile,
						JobKind.copyFile,
					].includes(job.kind) &&
					job.newUri
				) {
					uriSet.add(job.newUri);
				}

				if (
					[JobKind.rewriteFile, JobKind.deleteFile].includes(
						job.kind,
					) &&
					job.oldUri
				) {
					uriSet.add(job.oldUri);
				}
			}

			const uris = Array.from(uriSet);

			const children = uris.map((uri): FileElement => {
				const label = uri.fsPath.replace(rootPath, '');

				const children = jobs
					.filter(
						(job) =>
							job.newUri?.toString() === uri.toString() ||
							job.oldUri?.toString() === uri.toString(),
					)
					.map((job) => buildJobElement(job, rootPath));

				return buildFileElement(
					caseWithJobHashes.hash,
					label,
					children,
				);
			});

			unsortedCaseElements.push(
				buildCaseElement(caseWithJobHashes, children),
			);
		}

		const sortedCaseElements = unsortedCaseElements
			.sort(compareCaseElements)
			.map((caseElement) => {
				const children = caseElement.children
					.slice()
					.sort(compareFileElements)
					.map((fileElement) => {
						const children = fileElement.children
							.slice()
							.sort(compareJobElements);

						return {
							...fileElement,
							children,
						};
					});

				return {
					...caseElement,
					children,
				};
			});

		return [sortedCaseElements, latestJob];
	}

	private __onClearStateMessage() {
		this.__folderMap.clear();

		const rootElement = {
			hash: '' as ElementHash,
			kind: ElementKind.CASE,
			children: [],
			label: '',
			codemodName: '',
		} as CaseElement;

		const tree = this.__getTreeByDirectory(rootElement);

		if (tree !== undefined) {
			this.setView({
				viewId: 'treeView',
				viewProps: {
					node: tree,
				},
			});
		}
	}

	private __onUpdateElementsMessage() {
		const rootPath = workspace.workspaceFolders?.[0]?.uri.path ?? '';

		const casesWithJobHashes = this.__caseManager.getCasesWithJobHashes();

		const jobMap = this.__buildJobMap(casesWithJobHashes);

		const [caseElements] = this.__buildCaseElementsAndLatestJob(
			rootPath,
			casesWithJobHashes,
			jobMap,
		);

		if (caseElements.length === 0) {
			return;
		}

		const caseElement = caseElements[0] ?? null;
		if (caseElement === null) {
			return;
		}

		this.__folderMap.clear();

		const tree = this.__getTreeByDirectory(caseElement);

		if (tree) {
			this.setView({
				viewId: 'treeView',
				viewProps: {
					node: tree,
				},
			});
		}
	}

	private async __getUnsavedChanges() {
		const unsavedBranches = await this.__sourceControl.getUnsavedBranches();
		this.__unsavedChanges = unsavedBranches.length !== 0;
	}

	private __attachExtensionEventListeners() {
		const debouncedOnUpdateElementsMessage = debounce(async () => {
			this.__onUpdateElementsMessage();
			await this.__getUnsavedChanges();
			this.__onUpdateElementsMessage();
		}, 100);

		this.__addHook(MessageKind.updateElements, (message) => {
			debouncedOnUpdateElementsMessage(message);
		});

		this.__addHook(MessageKind.clearState, () =>
			this.__onClearStateMessage(),
		);
	}

	private __onDidReceiveMessage = (message: WebviewResponse) => {
		if (message.kind === 'webview.command') {
			if (message.value.command === 'intuita.openJobDiff') {
				const args = message.value.arguments;
				if (!args || !args[0]) {
					throw new Error('Expected args[0] to be job hash');
				}
				const jobHash = args[0];

				commands.executeCommand(message.value.command, jobHash);

				return;
			}

			commands.executeCommand(
				message.value.command,
				...(message.value.arguments ?? []),
			);
		}

		if (message.kind === 'webview.global.afterWebviewMounted') {
			this.__onUpdateElementsMessage();
		}
	};

	private __attachWebviewEventListeners() {
		if (!this.__view) {
			return;
		}

		this.__view.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
