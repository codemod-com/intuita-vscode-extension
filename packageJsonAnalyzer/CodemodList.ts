import {
	TreeItemCollapsibleState,
	commands,
	window,
	Event,
	EventEmitter,
	workspace,
	TreeItem,
	ThemeIcon,
	Uri,
} from 'vscode';
import { readFileSync } from 'fs';
import { buildHash, debounce } from '../src/utilities';
import { MessageBus, MessageKind } from '../src/components/messageBus';
import { watchFileWithPattern } from '../src/fileWatcher';
import { CodemodHash, PathHash, Path, PackageUpgradeItem } from './types';
import { CodemodItem } from './codemodItem';
import { commandList } from './constants';
import { checkIfCodemodIsAvailable, pathExists } from './utils';

class CodemodTreeProvider {
	#rootPath: string | null;
	#messageBus: MessageBus;
	#codemodItemsMap: Map<CodemodHash | PathHash, CodemodItem | Path> =
		new Map();
	readonly #eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;

	constructor(rootPath: string | null, messageBus: MessageBus) {
		this.#rootPath = rootPath;
		this.#messageBus = messageBus;
		this.onDidChangeTreeData = this.#eventEmitter.event;
		this.getPackageJsonListAndWatch();

		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
			const codemodItemFound = this.getTreeItem(
				message.codemodHash as CodemodHash,
			) as CodemodItem | undefined;
			if (!codemodItemFound) {
				return;
			}
			this.runCodemod(
				codemodItemFound.commandToExecute,
				codemodItemFound.pathToExecute,
			);
		});
	}

	async getPackageJsonListAndWatch() {
		const packageJsonList = await this.getPackageJsonList();
		if (!packageJsonList.length) {
			this.showRootPathUndefinedMessage();
			return;
		}
		const watcher = this.watchPackageJson();
		this.#messageBus.subscribe(MessageKind.extensionDeactivated, () => {
			watcher?.dispose();
		});

		this.getCodemods();
	}

	async getCodemods() {
		if (!this.#rootPath) {
			return;
		}
		const packageJsonList = await this.getPackageJsonList();

		const codemods: Map<CodemodHash | PathHash, CodemodItem | Path> =
			new Map();

		packageJsonList.forEach((uri) => {
			if (!pathExists(uri.fsPath)) {
				return;
			}
			const CodemodsFromPackageJson = this.getDepsInPackageJson(
				uri.fsPath,
			);
			if (!CodemodsFromPackageJson?.size) {
				return;
			}
			const pathFromRoot = uri.fsPath
				.replace('/package.json', '')
				.replace(this.#rootPath as string, '');

			const splitParts = pathFromRoot.split('/');
			CodemodsFromPackageJson.forEach((codemodItem, codemodHash) => {
				codemods.set(codemodHash, codemodItem);
			});
			splitParts.forEach((part, index, parts) => {
				const currentPWD = `${this.#rootPath}${parts
					.slice(0, index + 1)
					.join('/')}`;

				const nextPWD =
					index + 1 < parts.length
						? `${this.#rootPath}${parts
								.slice(0, index + 2)
								.join('/')}`
						: null;

				const pathHash = buildHash(currentPWD) as PathHash;
				const children = new Set<PathHash | CodemodHash>();
				if (!nextPWD) {
					const codemodsHash = [...CodemodsFromPackageJson.keys()];
					codemodsHash.forEach((codemodHash) => {
						children.add(codemodHash);
					});
				} else {
					children.add(buildHash(nextPWD) as PathHash);
				}

				if (codemods.has(pathHash)) {
					const current = codemods.get(pathHash) as Path;
					current.children.forEach((child) => {
						children.add(child);
					});

					current.children = Array.from(children);
					codemods.set(pathHash, current);
					return;
				}
				const path = {
					hash: pathHash,
					kind: 'path',
					path: currentPWD,
					label: part,
					children: Array.from(children),
				} as Path;
				codemods.set(pathHash, path);
			});
		});
		this.#codemodItemsMap = codemods;
		this.#eventEmitter.fire();
	}

	async getPackageJsonList() {
		try {
			const uris = await workspace.findFiles(
				'**/package.json',
				'node_modules/**',
				100,
			);
			return uris;
		} catch (error) {
			console.error(error);
			return [];
		}
	}
	watchPackageJson() {
		return watchFileWithPattern(
			'**/package.json',
			debounce(this.getCodemods.bind(this), 50),
		);
	}

	showRootPathUndefinedMessage() {
		window.showInformationMessage(
			'Unable to find package.json to list avaliable codemods. Please open a project folder.',
		);
	}

	getUnsortedChildren(
		el: CodemodHash | PathHash,
	): (CodemodHash | PathHash)[] {
		if (!this.#rootPath) return [];
		if (el) {
			const parent = this.#codemodItemsMap.get(el);
			if (!parent) {
				return [];
			}
			if ('kind' in parent && parent.kind === 'path') {
				return parent?.children || [];
			}
			return [el];
		}
		// List codemods starting from the root
		const root = this.#codemodItemsMap.get(
			buildHash(this.#rootPath) as PathHash,
		) as Path;
		return root?.children || [];
	}

	getChildren(el: CodemodHash | PathHash): (CodemodHash | PathHash)[] {
		const children = this.getUnsortedChildren(el);
		const sortedChildren = children
			.map((el) => this.#codemodItemsMap.get(el))
			.sort((a, b) => {
				if (!a || !b) return 0;
				if (
					'kind' in a &&
					a.kind === 'path' &&
					'kind' in b &&
					b.kind === 'path'
				) {
					return a.label.localeCompare(b.label);
				}
				if ('kind' in b && b.kind === 'path') {
					return -1;
				}
				if ('kind' in a && a.kind === 'path') {
					return 1;
				}
				return 0;
			});
		return sortedChildren.flatMap((el) => (el?.hash ? [el.hash] : []));
	}

	public runCodemod(command: string, path: string) {
		commands.executeCommand(command, Uri.parse(path));
	}

	getTreeItem(
		element: CodemodHash | PathHash,
	): CodemodItem | Path | TreeItem {
		const foundElement = this.#codemodItemsMap.get(element);
		if (!foundElement) {
			throw new Error('Element not found');
		}
		if ('kind' in foundElement && foundElement.kind === 'path') {
			const treeItem = new TreeItem(foundElement.label);
			treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
			treeItem.iconPath = new ThemeIcon('folder');

			return treeItem;
		}

		return foundElement;
	}

	private getDepsInPackageJson(
		path: string,
	): Map<CodemodHash, CodemodItem> | null {
		if (!pathExists(path)) {
			return null;
		}
		const executionPath = path.replace('/package.json', '');
		const document = JSON.parse(readFileSync(path, 'utf-8')) as {
			dependencies: Record<string, string>;
		};
		let dependencyCodemods: PackageUpgradeItem[] = [];
		const foundDependencies = document.dependencies;

		for (const key in foundDependencies) {
			const checkedDependency = checkIfCodemodIsAvailable(
				key,
				foundDependencies[key] as string,
			);
			if (checkedDependency && checkedDependency.length > 0) {
				dependencyCodemods =
					dependencyCodemods.concat(checkedDependency);
			}
		}

		return dependencyCodemods
			.filter((el) => el)
			.reduce((acc, curr) => {
				const command = commandList[curr.id] as string;

				const codemodItem = new CodemodItem(
					curr.name,
					`${curr.kind} ${curr.packageName} ${curr.leastVersionSupported} - ${curr.latestVersionSupported}`,
					TreeItemCollapsibleState.None,
					command,
					executionPath,
				);

				acc.set(codemodItem.hash, codemodItem);

				return acc;
			}, new Map<CodemodHash, CodemodItem>());
	}
}

export { CodemodItem, CodemodTreeProvider, checkIfCodemodIsAvailable };
