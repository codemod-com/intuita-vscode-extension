import { readFileSync } from 'fs';
import { capitalize, isNeitherNullNorUndefined } from '../utilities';
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
	#publicCodemods: Map<CodemodHash, CodemodElement> = new Map();

	constructor(
		rootPath: string | null,
		private __engineService: EngineService,
	) {
		this.#rootPath = rootPath;
	}
	updateCodemodItemPath = (codemodHash: CodemodHash, newPath: string) => {
		const codemodItem = this.#publicCodemods.get(codemodHash);
		if (!codemodItem || codemodItem.kind === 'path') {
			return;
		}
		const newCodemodItem = {
			...codemodItem,
			pathToExecute: newPath,
		};

		this.#publicCodemods.set(codemodHash, newCodemodItem);
	};

	__makePathItem(path: string, label: string) {
		const rootPath = this.#rootPath ?? '';

		const hashlessPathItem = {
			kind: 'path' as const,
			label,
			path: `${rootPath}${path}`,
			children: [] as CodemodHash[],
		};

		const hash = buildCodemodElementHash(hashlessPathItem);
		const pathItem = {
			...hashlessPathItem,
			hash,
		};

		return pathItem;
	}

	haltCurrentCodemodExecution = () => {
		this.__engineService.shutdownEngines();
	};

	__makeTitleReadable(name: string) {
		return name
			.split('-')
			.map((word) => capitalize(word))
			.join(' ');
	}

	getDiscoveredCodemods = async () => {
		const path = this.#rootPath ?? '';

		if (this.#publicCodemods.size) {
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
			discoveredCodemods.set(codemod.hash, codemod);

			nameParts.slice(0, -1).forEach((part, index, parts) => {
				const currentWD = `${parts.slice(0, index + 1).join('/')}`;
				const nextWD =
					index + 1 < parts.length
						? `${parts.slice(0, index + 2).join('/')}`
						: null;
				const currentPathItem = this.__makePathItem(currentWD, part);
				const nextPathItem =
					index + 1 < parts.length && nextWD
						? this.__makePathItem(
								nextWD,
								parts[index + 1] as string,
						  )
						: null;
				const children = new Set<CodemodHash>();

				if (nextPathItem !== null) {
					children.add(nextPathItem.hash);
				}

				if (discoveredCodemods.has(currentPathItem.hash)) {
					const existingPathItem = discoveredCodemods.get(
						currentPathItem.hash,
					);

					if (existingPathItem?.kind === 'path') {
						existingPathItem.children.forEach((item) => {
							children.add(item);
						});
					}
				}

				if (index === 0) {
					keys.add(currentPathItem.hash);
				}
				if (nextPathItem) {
					currentPathItem.children.push(nextPathItem.hash);
				}
				if (index === parts.length - 1) {
					children.add(codemod.hash);
				}

				discoveredCodemods.set(currentPathItem.hash, {
					...currentPathItem,
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

	public getCodemodItem = (codemodHash: CodemodHash) => {
		return this.#publicCodemods.get(codemodHash);
	};

	public getCodemodElement = (codemodHash: CodemodHash) => {
		return this.#publicCodemods.get(codemodHash);
	};

	async getCodemods(): Promise<void> {
		const rootPath = this.#rootPath ?? '';

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
	}

	public getListOfCodemodCommands() {
		return Object.values(commandList);
	}

	getUnsortedChildren(el: CodemodHash | null): CodemodHash[] {
		const rootPath = this.#rootPath ?? '';
		if (el) {
			const parent = this.#publicCodemods.get(el);
			if (!parent) {
				return [];
			}
			if (parent.kind === 'path') {
				return parent.children;
			}
			return [el];
		}
		// List codemods starting from the root
		const rootCodemodPath = Array.from(this.#publicCodemods.values()).find(
			(el) => el.kind === 'path' && el.path === rootPath,
		);
		if (!rootCodemodPath || rootCodemodPath.kind !== 'path') {
			return [];
		}
		return [rootCodemodPath.hash];
	}

	getChildren(el?: CodemodHash | undefined): CodemodHash[] {
		const children = this.getUnsortedChildren(el ?? null);
		const sortedChildren = children
			.map((el) => this.#publicCodemods.get(el))
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
