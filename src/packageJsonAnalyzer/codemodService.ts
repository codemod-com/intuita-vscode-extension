import { commands, Uri } from 'vscode';
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
import { EngineService } from '../components/engineService';

export class CodemodService {
	#rootPath: string | null;
	#codemodItemsMap: Map<CodemodHash, CodemodElement> = new Map();
	#publicCodemods: Map<CodemodHash, CodemodElement> = new Map();

	constructor(
		rootPath: string | null,
		private __engineService: EngineService,
	) {
		this.#rootPath = rootPath;
	}

	__makePathItem(path: string, label: string) {
		const hashlessPathItem = {
			kind: 'path' as const,
			label,
			path: `${this.#rootPath}${path}`,
			children: [] as CodemodHash[],
		};

		const hash = buildCodemodElementHash(hashlessPathItem);
		const pathItem = {
			...hashlessPathItem,
			hash,
		};

		return pathItem;
	}
	__makeTitleReadable(name: string) {
		const words = name.split('-');

		const capitalizedWords = words.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});

		const transformedString = capitalizedWords.join(' ');

		return transformedString;
	}
	getDiscoverdCodemods = async () => {
		const path = this.#rootPath;
		if (!path) {
			return;
		}
		const publicCodemods = await this.__engineService.getCodemodList();
		const discoveredCodemods = new Map<CodemodHash, CodemodElement>();
		const keys = new Set<CodemodHash>();
		publicCodemods.forEach((el) => {
			const { name, hashDigest, description } = el;
			const nameParts = name.includes('/')
				? name.split('/')
				: name.split(':');

			const codemod = {
				...el,
				kind: 'codemodItem' as const,
				hash: hashDigest as CodemodHash,
				label: this.__makeTitleReadable(
					nameParts[nameParts.length - 1] as string,
				),
				pathToExecute: path,
				// TODO: remove codemod to execute (once cleaned up the codemod tree)
				commandToExecute: name,
				description,
			};
			discoveredCodemods.set(codemod.hashDigest as CodemodHash, codemod);

			nameParts.slice(0, -1).forEach((part, index, parts) => {
				const currentWD = `${parts.slice(0, index + 1).join('/')}`;
				const nextWD =
					index + 1 < parts.length
						? `${parts.slice(0, index + 2).join('/')}`
						: null;
				const currentpathItem = this.__makePathItem(currentWD, part);
				const nextPathItem =
					index + 1 < parts.length && nextWD
						? this.__makePathItem(
								nextWD,
								parts[index + 1] as string,
						  )
						: null;
				const children = new Set<CodemodHash>();
				nextPathItem && children.add(nextPathItem.hash);
				if (discoveredCodemods.has(currentpathItem.hash)) {
					const existingPathItem = discoveredCodemods.get(
						currentpathItem.hash,
					);

					if (existingPathItem?.kind === 'path') {
						existingPathItem.children.forEach((item) => {
							children.add(item);
						});
					}
				}

				if (index === 0) {
					keys.add(currentpathItem.hash);
				}
				if (nextPathItem) {
					currentpathItem.children.push(nextPathItem.hash);
				}
				if (index === parts.length - 1) {
					children.add(codemod.hash);
				}

				discoveredCodemods.set(currentpathItem.hash, {
					...currentpathItem,
					children: Array.from(children),
				});
			});
		});

		const rootPath = {
			label: path,
			kind: 'path' as const,
			path,
			children: Array.from(keys),
		};
		const hash = buildCodemodElementHash(rootPath);

		discoveredCodemods.set(hash, {
			...rootPath,
			hash,
		});
		this.#publicCodemods = discoveredCodemods;
	};

	public getCodemodElement = (
		recommended: boolean,
		codemodHash: CodemodHash,
	) => {
		return recommended
			? this.#codemodItemsMap.get(codemodHash)
			: this.#publicCodemods.get(codemodHash);
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
				const currentWD = `${splitParts.slice(0, index + 1).join('/')}`;

				const nextWD =
					index + 1 < splitParts.length
						? `${splitParts.slice(0, index + 2).join('/')}`
						: null;
				const nextLabel =
					index + 1 < splitParts.length
						? splitParts[index + 1]
						: null;

				const codemodPath = this.__makePathItem(currentWD, part);
				const children = new Set<CodemodHash>();

				if (!nextWD || !nextLabel) {
					for (const codemodHash of codemodsFromPackageJson.keys()) {
						children.add(codemodHash);
					}
				} else {
					const nextPath = this.__makePathItem(nextWD, nextLabel);
					children.add(nextPath.hash);
				}

				{
					const current = codemods.get(codemodPath.hash);

					if (current && current.kind === 'path') {
						current.children.forEach((child) => {
							children.add(child);
						});

						codemods.set(codemodPath.hash, {
							...current,
							children: Array.from(children),
						});

						return;
					}
				}

				codemods.set(codemodPath.hash, {
					...codemodPath,
					children: Array.from(children),
				});
			});
		}

		this.#codemodItemsMap = codemods;
	}

	public getListOfCodemodCommands() {
		return Object.values(commandList);
	}
	getUnsortedChildren(
		recommended: boolean,
		el: CodemodHash | null,
	): CodemodHash[] {
		if (!this.#rootPath) return [];
		if (el) {
			const parent = recommended
				? this.#codemodItemsMap.get(el)
				: this.#publicCodemods.get(el);
			if (!parent) {
				return [];
			}
			if (parent.kind === 'path') {
				return parent.children;
			}
			return [el];
		}
		// List codemods starting from the root
		const rootCodemodPath = Array.from(
			recommended
				? this.#codemodItemsMap.values()
				: this.#publicCodemods.values(),
		).find((el) => el.kind === 'path' && el.path === this.#rootPath);
		if (!rootCodemodPath || rootCodemodPath.kind !== 'path') {
			return [];
		}
		return [rootCodemodPath.hash];
	}

	getChildren(
		recommended: boolean,
		el?: CodemodHash | undefined,
	): CodemodHash[] {
		const children = this.getUnsortedChildren(recommended, el ?? null);
		const sortedChildren = children
			.map((el) =>
				recommended
					? this.#codemodItemsMap.get(el)
					: this.#publicCodemods.get(el),
			)
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
