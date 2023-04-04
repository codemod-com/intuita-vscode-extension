import {
	TreeItem,
	TreeItemCollapsibleState,
	commands,
	window,
	Event,
	EventEmitter,
} from 'vscode';
import path from 'path';
import { accessSync, readFileSync } from 'fs';
import { buildHash, debounce, isNeitherNullNorUndefined } from '../utilities';
import { MessageBus, MessageKind } from '../components/messageBus';
import { watchFile } from '../fileWatcher';

export type CodemodHash = string & { __type: 'CodemodHash' };

type PackageUpgradeItem = Readonly<{
	id: string;
	packageName: string;
	name: string;
	kind: 'upgrade' | 'migration' | 'remove';
	leastVersionSupported: string;
	latestVersionSupported: string;
	leastSupportedUpgrade: string;
}>;

const commandList: Record<string, string> = {
	next13: 'intuita.executeNextJsCodemods',
	next13experimental: 'intuita.executeNextJsExperimentalCodemods',
	materialUI5: 'intuita.executeMuiCodemods',
	redwoodJS4: 'intuita.executeRedwoodJsCore4Codemods',
	reactRouterDom6: 'intuita.executeReactRouterv6Codemods',
	immutableJSV4: 'intuita.executeImmutableJSv4Codemods',
	immutableJS0: 'intuita.executeImmutableJSv0Codemods',
};

// TODO: get this from an API
const packageUpgradeList: PackageUpgradeItem[] = [
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

const buildCodemodItemHash = (codemodItem: CodemodItem) => {
	return buildHash(
		`${codemodItem.label} ${codemodItem.id} ${codemodItem.commandToExecute}`,
	) as CodemodHash;
};

class CodemodItem extends TreeItem {
	readonly kind: string;
	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly commandToExecute: string,
	) {
		super(label, collapsibleState);
		this.description = description;
		this.tooltip = `${label}-${description}`;
		this.kind = 'codemodItem';
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

class CodemodTreeProvider {
	#packageJsonPath: string | null;
	#messageBus: MessageBus;
	#codemodItemsMap: Map<CodemodHash, CodemodItem> = new Map();
	#watchedPackageJson: ReturnType<typeof watchFile> | undefined;
	readonly #eventEmitter = new EventEmitter<void>();
	public readonly onDidChangeTreeData: Event<void>;

	constructor(rootPath: string | null, messageBus: MessageBus) {
		const packageJsonPath = rootPath && path.join(rootPath, 'package.json');
		this.#packageJsonPath =
			packageJsonPath && this.pathExists(packageJsonPath)
				? packageJsonPath
				: null;
		if (!this.#packageJsonPath) {
			this.showRootPathUndefinedMessage();
		}

		this.#messageBus = messageBus;
		this.#watchedPackageJson = this.watchPackageJson();
		this.updateCodemodItemsMap();
		this.onDidChangeTreeData = this.#eventEmitter.event;
		this.#messageBus = messageBus;
		this.#messageBus.subscribe(MessageKind.runCodemod, (message) => {
			const codemodItemFound = this.getTreeItem(
				message.codemodHash as CodemodHash,
			);
			this.runCodemod(codemodItemFound.commandToExecute);
		});

		this.#messageBus.subscribe(MessageKind.extensionDeactivated, () => {
			this.dispose();
		});
	}

	watchPackageJson() {
		if (!this.#packageJsonPath) {
			return;
		}
		return watchFile(
			this.#packageJsonPath,
			debounce(this.updateCodemodItemsMap.bind(this), 50),
		);
	}

	dispose() {
		this.#watchedPackageJson?.dispose();
	}

	updateCodemodItemsMap() {
		const dependencies = this.getDepsInPackageJson();
		if (dependencies) {
			this.#codemodItemsMap = dependencies;
			this.#eventEmitter.fire();
		}
	}

	showRootPathUndefinedMessage() {
		window.showInformationMessage(
			'Unable to find package.json to list avaliable codemods. Please open a project folder.',
		);
	}

	getChildren(): CodemodHash[] {
		if (!this.#packageJsonPath) {
			return [];
		}
		return Array.from(this.#codemodItemsMap.keys());
	}

	public runCodemod(codemod: string) {
		commands.executeCommand(codemod);
	}

	getTreeItem(element: CodemodHash): CodemodItem {
		return this.#codemodItemsMap.get(element) as CodemodItem;
	}

	private getDepsInPackageJson(): Map<CodemodHash, CodemodItem> | null {
		if (!this.#packageJsonPath) {
			return null;
		}

		const document = JSON.parse(
			readFileSync(this.#packageJsonPath, 'utf-8'),
		) as {
			dependencies: Record<string, string>;
		};
		let dependencyCodemods: PackageUpgradeItem[] = [];
		const foundDependencies = document.dependencies;

		for (const key in foundDependencies) {
			const checkedDependency = this.checkIfCodemodIsAvailable(
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

	private checkIfCodemodIsAvailable(
		dependencyName: string,
		version: string,
	): null | readonly PackageUpgradeItem[] {
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
	}
}

export { CodemodItem, CodemodTreeProvider };
