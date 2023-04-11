import {
	TreeItemCollapsibleState,
	commands,
	window,
	Event,
	EventEmitter,
	TreeItem,
	ThemeIcon,
	Uri,
} from 'vscode';
import { readFileSync } from 'fs';
import { buildHash, debounce } from '../src/utilities';
import { MessageBus, MessageKind } from '../src/components/messageBus';
import { watchFileWithPattern } from '../src/fileWatcher';
import { CodemodHash, Path, CodemodItem, PackageUpgradeItem } from './types';
import { commandList } from './constants';
import {
	getDependencyUpgrades,
	pathExists,
	getPackageJsonList,
	buildCodemodItemHash,
} from './utils';
import path from 'path';

class CodemodTreeProvider {
	#rootPath: string | null;
	#messageBus: MessageBus;
	#codemodItemsMap: Map<CodemodHash, CodemodItem | Path> = new Map();
	readonly #eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;

	constructor(rootPath: string | null, messageBus: MessageBus) {
		this.#rootPath = rootPath;
		this.#messageBus = messageBus;
		this.onDidChangeTreeData = this.#eventEmitter.event;
		this.getPackageJsonListAndWatch();

		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
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

		const codemods: Map<CodemodHash, CodemodItem | Path> = new Map();

		for (const uri of packageJsonList) {
			const pathExist = await pathExists(uri.fsPath);
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
					path: currentWD,
					label: part,
					children: Array.from(children),
				} as Path;
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

	getUnsortedChildren(el: CodemodHash): CodemodHash[] {
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
			buildHash(this.#rootPath) as CodemodHash,
		) as Path;
		return root?.children || [];
	}

	getChildren(el: CodemodHash): CodemodHash[] {
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
	): Promise<Map<CodemodHash, CodemodItem> | null> {
		const pathExist = await pathExists(path);
		if (!pathExist) {
			return null;
		}
		const executionPath = path.replace('/package.json', '');
		const document = JSON.parse(readFileSync(path, 'utf-8')) as {
			dependencies: Record<string, string>;
		};
		let dependencyCodemods: PackageUpgradeItem[] = [];
		const foundDependencies = document.dependencies;

		for (const key in foundDependencies) {
			const checkedDependency = getDependencyUpgrades(
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

				const hashlessCodemodItem = {
					commandToExecute: command,
					pathToExecute: executionPath,
					label: curr.name,
					kind: 'codemodItem',
					description: `${curr.kind} ${curr.packageName} ${curr.leastVersionSupported} - ${curr.latestVersionSupported}`,
				} as Omit<CodemodItem, 'hash'>;
				const hash = buildCodemodItemHash(hashlessCodemodItem);
				acc.set(hash, {
					...hashlessCodemodItem,
					hash,
				});

				return acc;
			}, new Map<CodemodHash, CodemodItem>());
	}
}

export {
	CodemodItem,
	CodemodTreeProvider,
	getDependencyUpgrades as checkIfCodemodIsAvailable,
};
