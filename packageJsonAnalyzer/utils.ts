import { Uri, workspace } from 'vscode';
import { CodemodItem } from './types';
import { CodemodHash, PackageUpgradeItem } from './types';
import { buildHash, isNeitherNullNorUndefined } from '../src/utilities';
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

export const pathExists = async (path: string): Promise<boolean> => {
	try {
		await workspace.fs.stat(Uri.file(path));
	} catch (err) {
		return false;
	}
	return true;
};

export const getPackageJsonList = async () => {
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
};
