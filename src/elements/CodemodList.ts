import {
	TreeItem,
	TreeItemCollapsibleState,
	commands,
	window,
	Event,
	EventEmitter,
	workspace,
	Uri,
	TreeItem2,
	ThemeIcon,
} from 'vscode';
import path from 'path';
import { accessSync, readFileSync } from 'fs';
import { buildHash, debounce, isNeitherNullNorUndefined } from '../utilities';
import { MessageBus, MessageKind } from '../components/messageBus';
import { watchFileWithPattern, watchFiles } from '../fileWatcher';

export type CodemodHash = string & { __type: 'CodemodHash' };
export type PathHash = string & { __type: 'PathHash' };

type CodemodKind = 'upgrade' | 'migration' | 'remove';

export type PackageUpgradeItem = Readonly<{
	id: string;
	packageName: string;
	name: string;
	kind: CodemodKind;
	leastVersionSupported: string;
	latestVersionSupported: string;
	leastSupportedUpgrade: string;
}>;

export const commandList: Record<string, string> = {
	next13: 'intuita.executeNextJsCodemods',
	next13experimental: 'intuita.executeNextJsExperimentalCodemods',
	materialUI5: 'intuita.executeMuiCodemods',
	redwoodJS4: 'intuita.executeRedwoodJsCore4Codemods',
	reactRouterDom6: 'intuita.executeReactRouterv6Codemods',
	immutableJSV4: 'intuita.executeImmutableJSv4Codemods',
	immutableJS0: 'intuita.executeImmutableJSv0Codemods',
};

// TODO: get this from an API
export const packageUpgradeList: PackageUpgradeItem[] = [
	{
		id: 'next13',
		packageName: 'next',
		name: 'Next13 Codemods',
		kind: 'upgrade',
		leastVersionSupported: '13.0.0',
		latestVersionSupported: '13.2.4',
		leastSupportedUpgrade: '12.0.0',
	},
	{
		id: 'next13experimental',
		packageName: 'next',
		name: 'Next13 Experimental Codemods',
		kind: 'upgrade',
		leastVersionSupported: '13.0.0',
		latestVersionSupported: '13.2.4',
		leastSupportedUpgrade: '12.0.0',
	},
	{
		id: 'materialUI5',
		packageName: '@material-ui/core',
		name: 'MaterialUI5 Codemods',
		kind: 'migration',
		leastVersionSupported: '5.0.0',
		latestVersionSupported: '5.11.15',
		leastSupportedUpgrade: '4.0.0',
	},
	{
		id: 'redwoodJS4',
		packageName: '@redwoodjs/core',
		name: 'RedwoodJS4 Codemods',
		kind: 'migration',
		leastVersionSupported: '4.0.0',
		latestVersionSupported: '4.0.0',
		leastSupportedUpgrade: '3.0.0',
	},
	{
		id: 'reactRouterDom6',
		packageName: 'react-router-dom',
		name: 'ReactRouterDom6 Codemods',
		kind: 'migration',
		leastVersionSupported: '6.0.0',
		latestVersionSupported: '6.9.0',
		leastSupportedUpgrade: '5.0.0',
	},
	{
		id: 'immutableJSV4',
		packageName: 'immutable',
		name: 'ImmutableJS4 Codemods',
		kind: 'upgrade',
		leastVersionSupported: '4.0.0',
		latestVersionSupported: '4.0.0',
		leastSupportedUpgrade: '3.0.0',
	},
	{
		id: 'immutableJS0',
		packageName: 'immutable',
		name: 'ImmutableJS4 removal Codemods',
		kind: 'remove',
		leastVersionSupported: '4.0.0',
		latestVersionSupported: '4.0.0',
		leastSupportedUpgrade: '3.0.0',
	},
];

export const packageListMap = new Map<string, PackageUpgradeItem>(
	packageUpgradeList.map((item) => [item.id, item]),
);

const buildCodemodItemHash = (codemodItem: CodemodItem) => {
	return buildHash(
		`${codemodItem.label} ${codemodItem.id} ${codemodItem.commandToExecute}`,
	) as CodemodHash;
};

const checkIfCodemodIsAvailable = (
	dependencyName: string,
	version: string,
): null | readonly PackageUpgradeItem[] => {
	// replace ^, ~ , *
	const actualVersion = version.replace(/[^0-9.]/g, '');

	const codemod = packageUpgradeList.filter(
		(el) => el.packageName === dependencyName,
	);

	if (!codemod.length) {
		return null;
	}

	return codemod
		.map((el) => {
			const { leastVersionSupported, leastSupportedUpgrade } = el;

			if (
				actualVersion < leastVersionSupported &&
				actualVersion >= leastSupportedUpgrade
			) {
				return el;
			}

			return null;
		})
		.filter(isNeitherNullNorUndefined);
};

class CodemodItem extends TreeItem {
	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly commandToExecute: string,
	) {
		super(label, collapsibleState);
		this.description = description;
		this.tooltip = `${label}-${description}`;
		this.contextValue = 'codemodItem';
		this.commandToExecute = commandToExecute;
	}

	iconPath = path.join(
		__filename,
		'..',
		'..',
		'resources',
		'bluelightbulb.svg',
	);
}

type Path = {
	hash: PathHash;
	path: string;
	label: string;
	kind: 'path';
	children: (PathHash | CodemodHash)[];
};

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

		// TODO: support for codemod execution on different paths
		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
			const codemodItemFound = this.getTreeItem(
				message.codemodHash as CodemodHash,
			) as CodemodItem | undefined;
			if (!codemodItemFound) {
				return;
			}
			this.runCodemod(codemodItemFound.commandToExecute);
		});
	}

	async getPackageJsonListAndWatch() {
		const packageJsonList = await this.getPackageJsonList();
		if (!packageJsonList.length) {
			this.showRootPathUndefinedMessage();
			return;
		}
		const watcher = this.watchPackageJson(packageJsonList);
		this.#messageBus.subscribe(MessageKind.extensionDeactivated, () => {
			watcher?.forEach((el) => el.dispose());
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
		const codemodPaths: Map<CodemodHash, PathHash> = new Map();

		packageJsonList.forEach((uri) => {
			if (!this.pathExists(uri.fsPath)) {
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
				const children = [] as (PathHash | CodemodHash)[];
				if (!nextPWD) {
					CodemodsFromPackageJson.forEach((_, codemodHash) => {
						codemodPaths.set(codemodHash, pathHash);
					});
					children.push(...CodemodsFromPackageJson.keys());
				} else {
					children.push(buildHash(nextPWD) as PathHash);
				}

				if (codemods.has(pathHash)) {
					const current = codemods.get(pathHash) as Path;

					current.children = [...children, ...current.children];
					codemods.set(pathHash, current);
					return;
				}
				const path = {
					hash: pathHash,
					kind: 'path',
					path: currentPWD,
					label: part,
					children,
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
	watchPackageJson(uri: Uri[]) {
		if (!uri.length) {
			return;
		}
		return [
			watchFiles(uri, debounce(this.getCodemods.bind(this), 50)),
			watchFileWithPattern(
				'**/package.json',
				debounce(this.getCodemods.bind(this), 50),
			),
		];
	}

	showRootPathUndefinedMessage() {
		window.showInformationMessage(
			'Unable to find package.json to list avaliable codemods. Please open a project folder.',
		);
	}

	getChildren(el: CodemodHash | PathHash): (CodemodHash | PathHash)[] {
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

	public runCodemod(command: string) {
		commands.executeCommand(command);
	}

	getTreeItem(
		element: CodemodHash | PathHash,
	): CodemodItem | Path | TreeItem2 {
		const foundElement = this.#codemodItemsMap.get(element);
		if (!foundElement) {
			throw new Error('Element not found');
		}
		if ('kind' in foundElement && foundElement.kind === 'path') {
			const treeItem = new TreeItem2(foundElement.label);
			treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
			treeItem.iconPath = new ThemeIcon('folder');

			return treeItem;
		}

		return foundElement;
	}

	private getDepsInPackageJson(
		path: string,
	): Map<CodemodHash, CodemodItem> | null {
		if (!this.pathExists(path)) {
			return null;
		}

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
				);

				const hash = buildCodemodItemHash(codemodItem);
				acc.set(hash, codemodItem);

				return acc;
			}, new Map<CodemodHash, CodemodItem>());
	}

	private pathExists(p: string): boolean {
		try {
			accessSync(p);
		} catch (err) {
			return false;
		}
		return true;
	}
}

export { CodemodItem, CodemodTreeProvider, checkIfCodemodIsAvailable };
