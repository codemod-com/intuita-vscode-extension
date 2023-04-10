import { CodemodItem } from './codemodItem';
import { CodemodHash, PackageUpgradeItem } from './types';
import { buildHash, isNeitherNullNorUndefined } from '../src/utilities';
import { packageUpgradeList } from './constants';
import { accessSync } from 'fs';

export const buildCodemodItemHash = (codemodItem: CodemodItem) => {
	return buildHash(
		`${codemodItem.label} ${codemodItem.id} ${codemodItem.commandToExecute}${codemodItem.pathToExecute}`,
	) as CodemodHash;
};

export const checkIfCodemodIsAvailable = (
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

export const pathExists = (p: string): boolean => {
	try {
		accessSync(p);
	} catch (err) {
		return false;
	}
	return true;
};
