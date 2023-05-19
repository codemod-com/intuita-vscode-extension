import { Uri, workspace } from 'vscode';
import { CodemodElement } from './types';
import { CodemodHash } from './types';
import { buildHash, DistributiveOmit } from '../utilities';

export const buildCodemodElementHash = (
	element: DistributiveOmit<CodemodElement, 'hash'>,
) => {
	if (element.kind === 'codemodItem') {
		return buildHash(
			`${element.label}${element.commandToExecute}${element.pathToExecute}`,
		) as CodemodHash;
	}

	return buildHash(
		`${element.path}${element.kind}${element.label}`,
	) as CodemodHash;
};

export const doesPathExist = async (path: string): Promise<boolean> => {
	try {
		await workspace.fs.stat(Uri.file(path));

		return true;
	} catch (err) {
		return false;
	}
};
