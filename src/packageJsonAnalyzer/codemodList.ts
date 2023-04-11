import {
	TreeItemCollapsibleState,
	commands,
	window,
	Event,
	EventEmitter,
	TreeItem,
	ThemeIcon,
	Uri,
	TreeDataProvider,
} from 'vscode';
import { readFileSync } from 'fs';
import { buildHash, debounce, isNeitherNullNorUndefined } from '../utilities';
import { MessageBus, MessageKind } from '../components/messageBus';
import { watchFileWithPattern } from '../fileWatcher';
import {
	CodemodHash,
	CodemodPath,
	CodemodItem,
	PackageUpgradeItem,
	CodemodElement,
} from './types';
import { commandList } from './constants';
import {
	getDependencyUpgrades,
	doesPathExist,
	getPackageJsonList,
	buildCodemodItemHash,
} from './utils';
import path from 'path';

export class CodemodTreeProvider implements TreeDataProvider<CodemodHash> {
	#rootPath: string | null;
	#messageBus: MessageBus;
	#codemodItemsMap: Map<CodemodHash, CodemodElement> = new Map();
	readonly #eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;

	constructor(rootPath: string | null, messageBus: MessageBus) {
		this.#rootPath = rootPath;
		this.#messageBus = messageBus;
		this.onDidChangeTreeData = this.#eventEmitter.event;
		this.getPackageJsonListAndWatch();

		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
			// TODO fix types
			const codemodItemFound = this.#codemodItemsMap.get(
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
		const packageJsonList = await getPackageJsonList();
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
		const packageJsonList = await getPackageJsonList();

		const codemods: Map<CodemodHash, CodemodItem | CodemodPath> = new Map();

		for (const uri of packageJsonList) {
			const pathExist = await doesPathExist(uri.fsPath);
			if (!pathExist) {
				continue;
			}
			const CodemodsFromPackageJson = await this.getDepsInPackageJson(
				uri.fsPath,
			);
			if (!CodemodsFromPackageJson?.size) {
				continue;
			}
			const pathFromRoot = uri.fsPath
				.replace('/package.json', '')
				.replace(this.#rootPath as string, '');

			const splitParts = pathFromRoot.split('/');
			CodemodsFromPackageJson.forEach((codemodItem, codemodHash) => {
				codemods.set(codemodHash, codemodItem);
			});
			splitParts.forEach((part, index, parts) => {
				const currentWD = `${this.#rootPath}${parts
					.slice(0, index + 1)
					.join('/')}`;

				const nextWD =
					index + 1 < parts.length
						? `${this.#rootPath}${parts
								.slice(0, index + 2)
								.join('/')}`
						: null;

				const pathHash = buildHash(currentWD) as CodemodHash;
				const children = new Set<CodemodHash>();
				if (!nextWD) {
					const codemodsHash = [...CodemodsFromPackageJson.keys()];
					codemodsHash.forEach((codemodHash) => {
						children.add(codemodHash);
					});
				} else {
					children.add(buildHash(nextWD) as CodemodHash);
				}

				if (codemods.has(pathHash)) {
					const current = codemods.get(pathHash) as CodemodPath;
					current.children.forEach((child) => {
						children.add(child);
					});

					codemods.set(pathHash, {
						...current,
						children: Array.from(children),
					});

					return;
				}
				const path: CodemodPath = {
					hash: pathHash,
					kind: 'path',
					path: currentWD,
					label: part,
					children: Array.from(children),
				};
				codemods.set(pathHash, path);
			});
		}

		this.#codemodItemsMap = codemods;
		this.#eventEmitter.fire();
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

	getUnsortedChildren(el: CodemodHash | null): CodemodHash[] {
		if (!this.#rootPath) return [];
		if (el) {
			const parent = this.#codemodItemsMap.get(el);
			if (!parent) {
				return [];
			}
			if (parent.kind === 'path') {
				return parent.children;
			}
			return [el];
		}
		// List codemods starting from the root
		const root = this.#codemodItemsMap.get(
			buildHash(this.#rootPath) as CodemodHash,
		) as CodemodPath;
		return root?.children || [];
	}

	getChildren(el?: CodemodHash | undefined): CodemodHash[] {
		const children = this.getUnsortedChildren(el ?? null);

		const sortedChildren = children
			.map((el) => this.#codemodItemsMap.get(el))
			.filter(isNeitherNullNorUndefined)
			.sort((a, b) => {
				if (a.kind === 'path' && b.kind === 'path') {
					return a.label.localeCompare(b.label);
				}
				if (b.kind === 'path') {
					return -1;
				}
				if (a.kind === 'path') {
					return 1;
				}
				return 0;
			});
		return sortedChildren.map(({ hash }) => hash);
	}

	public runCodemod(command: string, path: string) {
		commands.executeCommand(command, Uri.parse(path));
	}

	getTreeItem(element: CodemodHash): TreeItem {
		const foundElement = this.#codemodItemsMap.get(element);
		if (!foundElement) {
			throw new Error('Element not found');
		}
		const isCodemod =
			'kind' in foundElement && foundElement.kind === 'codemodItem';

		const treeItem = new TreeItem(
			foundElement.label,
			isCodemod
				? TreeItemCollapsibleState.None
				: TreeItemCollapsibleState.Collapsed,
		);
		treeItem.iconPath = isCodemod
			? path.join(
					__filename,
					'..',
					'..',
					'resources',
					'bluelightbulb.svg',
			  )
			: new ThemeIcon('folder');
		treeItem.contextValue = isCodemod ? 'codemodItem' : 'path';

		if (isCodemod) {
			treeItem.description = foundElement.description;
		}

		return treeItem;
	}

	private async getDepsInPackageJson(
		path: string,
	): Promise<Map<CodemodHash, CodemodItem>> {
		const pathExists = await doesPathExist(path);
		if (!pathExists) {
			return new Map();
		}

		const executionPath = path.replace('/package.json', '');
		const document = JSON.parse(readFileSync(path, 'utf-8')) as {
			dependencies: Record<string, string>;
		};
		const dependencyCodemods: PackageUpgradeItem[] = [];
		const foundDependencies = document.dependencies;

		for (const key in foundDependencies) {
			const checkedDependencies = getDependencyUpgrades(
				key,
				foundDependencies[key] as string,
			);
			if (checkedDependencies.length !== 0) {
				dependencyCodemods.push(...checkedDependencies);
			}
		}

		return (
			dependencyCodemods
				.filter((el) => el)
				// TODO replace with .forEach
				.reduce((acc, curr) => {
					const command = commandList[curr.id] as string;

					const hashlessCodemodItem: Omit<CodemodItem, 'hash'> = {
						commandToExecute: command,
						pathToExecute: executionPath,
						label: curr.name,
						kind: 'codemodItem',
						description: `${curr.kind} ${curr.packageName} ${curr.leastVersionSupported} - ${curr.latestVersionSupported}`,
					};

					const hash = buildCodemodItemHash(hashlessCodemodItem);
					acc.set(hash, {
						...hashlessCodemodItem,
						hash,
					});

					return acc;
				}, new Map<CodemodHash, CodemodItem>())
		);
	}
}
