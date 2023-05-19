import { CodemodElement } from './types';
import { CodemodHash } from './types';
import { buildHash, DistributiveOmit } from '../utilities';

export const buildCodemodElementHash = (
	element: DistributiveOmit<CodemodElement, 'hash'>,
) => {
	if (element.kind === 'codemodItem') {
		return buildHash(
			`${element.label}${element.pathToExecute}`,
		) as CodemodHash;
	}

	return buildHash(
		`${element.path}${element.kind}${element.label}`,
	) as CodemodHash;
};
