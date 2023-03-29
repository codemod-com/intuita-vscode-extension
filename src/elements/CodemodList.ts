import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import path from 'path';
import { accessSync, readFileSync } from 'fs';

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

// make a record of the packageUpgradeList
const dependenciesRecord = packageUpgradeList.reduce((acc, curr) => {
	acc[curr.packageName] = curr;
	return acc;
}, {} as Record<string, PackageUpgradeItem>);

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

class CodemodService {
	rootPath: string | null | undefined;
	constructor(path: string | null | undefined) {
		this.rootPath = path;
	}

	getChildren(): CodemodItem[] {
		if (this.rootPath) return this.getDepsInPackageJson();
		else return [];
	}

	getElement(element: CodemodItem) {
		return element;
	}

	private getDepsInPackageJson(): CodemodItem[] {
		if (!this.rootPath) return [];
		const packageJsonPath = path.join(this.rootPath, 'package.json');
		if (this.pathExists(packageJsonPath)) {
			const document = JSON.parse(
				readFileSync(packageJsonPath, 'utf-8'),
			) as { dependencies: Record<string, string> };
			const dependencyCodemods: PackageUpgradeItem[] = [];
			const foundDependencies = document.dependencies;
			for (const key in foundDependencies) {
				const checkedDependency = this.checkIfCodemodIsAvailable(
					key,
					foundDependencies[key] as string,
				);
				if (checkedDependency) {
					dependencyCodemods.push(checkedDependency);
				}
			}
			const codemodList = dependencyCodemods
				.map((dependencyName) => {
					if (!dependencyName) return null;

					const command = commandList[dependencyName.id] as string;

					return new CodemodItem(
						dependencyName.name,
						`${dependencyName.kind} ${dependencyName.packageName} ${dependencyName.leastVersionSupported} - ${dependencyName.latestVersionSupported}`,
						TreeItemCollapsibleState.None,
						command,
					);
				})
				.filter(Boolean) as CodemodItem[];

			return codemodList;
		} else {
			return [];
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
	): null | PackageUpgradeItem {
		// replace ^, ~ , * 
		const versionStripped = version.replace(/[^0-9.]/g, '');

		const codemod = dependenciesRecord[dependencyName];
		if (codemod) {
			const { leastVersionSupported, leastSupportedUpgrade } = codemod;
			if (
				versionStripped < leastVersionSupported &&
				versionStripped > leastSupportedUpgrade
			) {
				return codemod;
			}
		}
		return null;
	}
}

export { CodemodItem, CodemodService };
