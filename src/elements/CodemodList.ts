import { TreeItem, TreeItemCollapsibleState, commands } from 'vscode';
import path from 'path';
import { accessSync, readFileSync } from 'fs';
import { buildHash } from '../utilities';
import { ElementHash } from './types';

type PackageUpgradeItem = {
	id: string;
	packageName: string;
	name: string;
	kind: 'upgrade' | 'migration' | 'refactor' | 'remove';
	leastVersionSupported: string;
	latestVersionSupported: string;
	leastSupportedUpgrade: string;
};

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
	) as ElementHash;
};

class CodemodItem extends TreeItem {
	readonly kind: string;
	readonly hash: string;
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
		this.hash = buildHash(`${this.label} ${this.commandToExecute}`);
	}
	iconPath = path.join(
		__filename,
		'..',
		'..',
		'resources',
		'bluelightbulb.svg',
	);
}

class CodemodService {
	rootPath: string | null | undefined;
	#codemodItemsMap: Map<ElementHash, CodemodItem> = new Map();

	constructor(path: string | null | undefined) {
		this.rootPath = path;
		const dependencies = this.getDepsInPackageJson();
		if (dependencies) {
			this.#codemodItemsMap = dependencies;
		}
	}

	getChildren(): ElementHash[] {
		if (this.rootPath) {
			return Array.from(this.#codemodItemsMap.keys());
		}
		return [];
	}

	public runCodemod(codemod: string) {
		commands.executeCommand(codemod);
	}

	getElement(element: ElementHash): CodemodItem {
		const el = this.#codemodItemsMap.get(element) as CodemodItem;
		return el;
	}

	private getDepsInPackageJson(): Map<ElementHash, CodemodItem> | null {
		if (!this.rootPath) return null;
		const packageJsonPath = path.join(this.rootPath, 'package.json');
		if (this.pathExists(packageJsonPath)) {
			const document = JSON.parse(
				readFileSync(packageJsonPath, 'utf-8'),
			) as { dependencies: Record<string, string> };
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
			const codemodList = dependencyCodemods
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
				}, new Map() as Map<ElementHash, CodemodItem>);
			return codemodList;
		} else {
			return null;
		}
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
	): null | PackageUpgradeItem[] {
		// replace ^, ~ , *
		const actualVersion = version.replace(/[^0-9.]/g, '');

		const codemod = packageUpgradeList.filter(
			(el) => el.packageName === dependencyName,
		);
		if (!codemod) return null;
		return codemod
			.map((el) => {
				if (el) {
					const { leastVersionSupported, leastSupportedUpgrade } = el;
					if (
						actualVersion < leastVersionSupported &&
						actualVersion >= leastSupportedUpgrade
					) {
						return el;
					}
				}
				return null;
			})
			.filter(Boolean) as PackageUpgradeItem[];
	}
}

export { CodemodItem, CodemodService };
