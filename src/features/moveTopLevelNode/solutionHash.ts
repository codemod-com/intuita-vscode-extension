import { buildHash } from '../../utilities';

export type SolutionHash = string & { __type: 'SolutionHash' };

export const buildSolutionHash = (ids: ReadonlyArray<string>): SolutionHash => {
	const hash = buildHash(JSON.stringify(ids));

	return hash as SolutionHash;
};
