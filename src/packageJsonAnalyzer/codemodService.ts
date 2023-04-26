import { commands, Event, EventEmitter, Uri } from 'vscode';
import { readFileSync } from 'fs';
import { isNeitherNullNorUndefined } from '../utilities';
import {
	CodemodHash,
	CodemodItem,
	PackageUpgradeItem,
	CodemodElement,
} from './types';
import { commandList } from './constants';
import {
	getDependencyUpgrades,
	doesPathExist,
	getPackageJsonUris,
	buildCodemodElementHash,
} from './utils';

export class CodemodService {
	#rootPath: string | null;
	#codemodItemsMap: Map<CodemodHash, CodemodElement> = new Map();
	readonly #eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;

	constructor(rootPath: string | null) {
		this.#rootPath = rootPath;
		this.onDidChangeTreeData = this.#eventEmitter.event;
		this.getPackageJsonList();
	}

	public getCodemodElement = (codemodHash: CodemodHash) => {
		return this.#codemodItemsMap.get(codemodHash);
	};

	async getPackageJsonList() {
		const packageJsonList = await getPackageJsonUris();
		if (!packageJsonList.length) {
			/**
			 * return silently if no package.json is found
			 */
			return;
		}

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
				const nextLabel =
					index + 1 < splitParts.length
						? splitParts[index + 1]
						: null;
				const currentWDHashlessCodemodPath = {
					label: part,
					kind: 'path' as const,
					path: currentWD,
					children: [],
				};
				const codemodPathHash = buildCodemodElementHash(
					currentWDHashlessCodemodPath,
				);
				const children = new Set<CodemodHash>();

				if (!nextWD || !nextLabel) {
					for (const codemodHash of codemodsFromPackageJson.keys()) {
						children.add(codemodHash);
					}
				} else {
					const nextHashlessCodemodPath = {
						label: nextLabel,
						kind: 'path' as const,
						path: nextWD,
						children: [],
					};
					children.add(
						buildCodemodElementHash(nextHashlessCodemodPath),
					);
				}

				{
					const current = codemods.get(codemodPathHash);

					if (current && current.kind === 'path') {
						current.children.forEach((child) => {
							children.add(child);
						});

						codemods.set(codemodPathHash, {
							...current,
							children: Array.from(children),
						});

						return;
					}
				}

				codemods.set(codemodPathHash, {
					...currentWDHashlessCodemodPath,
					hash: codemodPathHash,
					children: Array.from(children),
				});
			});
		}

		this.#codemodItemsMap = codemods;
	}

	public getListOfCodemodCommands() {
		return Object.values(commandList);
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
		const rootCodemodPath = Array.from(this.#codemodItemsMap.values()).find(
			(el) => el.kind === 'path' && el.path === this.#rootPath,
		);
		if (!rootCodemodPath || rootCodemodPath.kind !== 'path') {
			return [];
		}
		return [rootCodemodPath.hash];
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

		const codemodsHashMap = new Map<CodemodHash, CodemodItem>();
		dependencyCodemods
			.filter((el) => el)
			.forEach((codemod) => {
				const command = commandList[codemod.id] as string;

				const hashlessCodemodItem: Omit<CodemodItem, 'hash'> = {
					commandToExecute: command,
					pathToExecute: executionPath,
					label: codemod.name,
					kind: 'codemodItem',
					description: `${codemod.kind} ${codemod.packageName} to ${codemod.latestVersionSupported}`,
				};

				const hash = buildCodemodElementHash(hashlessCodemodItem);
				codemodsHashMap.set(hash, {
					...hashlessCodemodItem,
					hash,
				});
			});
		return codemodsHashMap;
	}
}
