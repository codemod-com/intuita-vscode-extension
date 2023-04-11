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
	getPackageJsonUris,
	buildCodemodItemHash,
} from './utils';
import path from 'path';
import { satisfies } from 'semver';

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
			const codemodElement = this.#codemodItemsMap.get(
				message.codemodHash,
			);

			if (!codemodElement || codemodElement.kind !== 'codemodItem') {
				return;
			}

			this.runCodemod(
				codemodElement.commandToExecute,
				codemodElement.pathToExecute,
			);
		});
	}

	async getPackageJsonListAndWatch() {
		const packageJsonList = await getPackageJsonUris();
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

	async getCodemods(): Promise<void> {
		const rootPath = this.#rootPath;

		if (rootPath === null) {
			return;
		}

		const packageJsonList = await getPackageJsonUris();

		const codemods: Map<CodemodHash, CodemodElement> = new Map();

		for (const uri of packageJsonList) {
			const pathExists = await doesPathExist(uri.fsPath);
			if (!pathExists) {
				continue;
			}

			const codemodsFromPackageJson = await this.getDepsInPackageJson(
				uri.fsPath,
			);

			if (!codemodsFromPackageJson.size) {
				continue;
			}

			const splitParts: readonly string[] = uri.fsPath
				.replace('/package.json', '')
				.replace(rootPath, '')
				.split('/');

			codemodsFromPackageJson.forEach((codemodItem, codemodHash) => {
				codemods.set(codemodHash, codemodItem);
			});

			splitParts.forEach((part, index) => {
				const currentWD = `${rootPath}${splitParts
					.slice(0, index + 1)
					.join('/')}`;

				const nextWD =
					index + 1 < splitParts.length
						? `${rootPath}${splitParts
								.slice(0, index + 2)
								.join('/')}`
						: null;

				const pathHash = buildHash(currentWD) as CodemodHash; // TODO construct the proper hash digest here
				const children = new Set<CodemodHash>();

				if (!nextWD) {
					for (const codemodHash of codemodsFromPackageJson.keys()) {
						children.add(codemodHash);
					}
				} else {
					children.add(buildHash(nextWD) as CodemodHash);
				}

				{
					const current = codemods.get(pathHash);

					if (current && current.kind === 'path') {
						current.children.forEach((child) => {
							children.add(child);
						});

						codemods.set(pathHash, {
							...current,
							children: Array.from(children),
						});

						return;
					}
				}

				codemods.set(pathHash, {
					hash: pathHash,
					kind: 'path',
					path: currentWD,
					label: part,
					children: Array.from(children),
				});
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
		) as CodemodPath; // TODO remove "as"
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
