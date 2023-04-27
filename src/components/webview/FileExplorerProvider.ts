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
import { getElementIconBaseName } from '../../utilities';
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

export class FileExplorerProvider implements WebviewViewProvider {
	__view: WebviewView | null = null;
	__extensionPath: Uri;
	__webviewResolver: WebviewResolver | null = null;
	__elementMap = new Map<ElementHash, Element>();
	__folderMap = new Map<string, TreeNode>();
	__fileNodes = new Set<TreeNode>();
	__unsavedChanges = false;

	constructor(
		context: ExtensionContext,
		private readonly __messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
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
			'fileExplorer',
			'{}',
		);
	}

	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		if (!webviewView.webview) {
			return;
		}

		this.__webviewResolver?.resolveWebview(
			webviewView.webview,
			'fileExplorer',
			'{}',
		);
		this.__view = webviewView;

		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public setView(data: View) {
		this.__postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	public updateExplorerView(caseHash: string | null) {
		if (caseHash === null) {
			return;
		}
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

		const caseElement = caseElements.find((kase) => kase.hash === caseHash);
		if (!caseElement) {
			return;
		}

		this.__folderMap.clear();
		this.__fileNodes.clear();

		const tree = this.__getTreeByDirectory(caseElement);

		if (tree) {
			this.setView({
				viewId: 'treeView',
				viewProps: {
					node: tree,
					nodeIds: Array.from(this.__folderMap.keys()),
					fileNodes: Array.from(this.__fileNodes),
				},
			});
		}
	}

	private __postMessage(message: WebviewMessage) {
		this.__view?.webview.postMessage(message);
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
				command: {
					title: 'Diff View',
					command: 'intuita.openCaseDiff',
					arguments: [element.hash],
				},
			});
			element.children.forEach(this.__getTreeByDirectory);
			const treeNode = this.__folderMap.get(repoName) ?? undefined;

			return treeNode;
		}

		if (element.kind === ElementKind.FILE) {
			if (element.children.length !== 1) {
				// every file element must have only 1 job child
				return;
			}

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

			const jobKind = element.children[0]?.job.kind;

			let path = repoName;
			for (const dir of directories) {
				const parentNode = this.__folderMap.get(path) ?? null;

				if (parentNode === null) {
					return;
				}

				path += `/${dir}`;
				if (!this.__folderMap.has(path)) {
					const newTreeNode: TreeNode =
						dir === fileName
							? {
									id: path,
									kind: 'fileElement',
									label: dir,
									iconName: getElementIconBaseName(
										ElementKind.FILE,
										jobKind ?? null,
									),
									children: [],
							  }
							: {
									id: path,
									kind: 'folderElement',
									label: dir,
									iconName: 'folder.svg',
									children: [],
							  };

					if (dir === fileName) {
						this.__fileNodes.add(newTreeNode);
					}
					this.__folderMap.set(path, newTreeNode);

					parentNode.children.push(newTreeNode);
				}
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

		const jobHashes = Array.from(casesWithJobHashes).flatMap((kase) =>
			Array.from(kase.jobHashes),
		);
		jobHashes.forEach((jobHash) => {
			const job = this.__jobManager.getJob(jobHash);

			if (!job) {
				return;
			}
			map.set(job.hash, job);
		});

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
		this.__fileNodes.clear();
		this.setView({
			viewId: 'treeView',
			viewProps: null,
		});
	}

	private __attachExtensionEventListeners() {
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
	};

	private __attachWebviewEventListeners() {
		this.__view?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
}
