import type { Uri } from 'vscode';
import { buildUriHash } from '../uris/buildUriHash';
import { buildHash } from '../utilities';
import { JobHash } from './types';

export const buildJobHash = (
	uris: ReadonlyArray<Uri>,
	codemodId: string,
): JobHash => {
	const uriHashes = uris.map((uri) => buildUriHash(uri));

	const hash = buildHash([...uriHashes, codemodId].join(','));

	return hash as JobHash;
};
