import { Uri, workspace } from 'vscode';
import { CodemodItem } from './types';
import { CodemodHash, PackageUpgradeItem } from './types';
import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { packageUpgradeList } from './constants';

export const buildCodemodItemHash = (
	codemodItem: Omit<CodemodItem, 'hash'>,
) => {
	return buildHash(
		`${codemodItem.label}${codemodItem.commandToExecute}${codemodItem.pathToExecute}`,
	) as CodemodHash;
};

export const getDependencyUpgrades = (
	dependencyName: string,
	version: string,
): readonly PackageUpgradeItem[] => {
	// replace ^, ~ , *
	const actualVersion = version.replace(/[^0-9.]/g, '');

	return packageUpgradeList
		.filter((el) => el.packageName === dependencyName)
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

export const doesPathExist = async (path: string): Promise<boolean> => {
	try {
		await workspace.fs.stat(Uri.file(path));

		return true;
	} catch (err) {
		return false;
	}
};

export const getPackageJsonUris = async (): Promise<ReadonlyArray<Uri>> => {
	try {
		return await workspace.findFiles(
			'**/package.json',
			'node_modules/**',
			100,
		);
	} catch (error) {
		console.error(error);
		return [];
	}
};
