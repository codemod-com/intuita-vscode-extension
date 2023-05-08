import { buildUriHash } from '../uris/buildUriHash';
import { buildHash } from '../utilities';
import { Job, JobHash } from './types';

export const buildJobHash = (
	hashlessJob: Omit<Job, 'hash'>,
	executionId: string,
): JobHash => {
	const hash = buildHash(
		[
			executionId,
			hashlessJob.kind,
			hashlessJob.oldUri ? buildUriHash(hashlessJob.oldUri) : '',
			hashlessJob.newUri ? buildUriHash(hashlessJob.newUri) : '',
			hashlessJob.newContentUri
				? buildUriHash(hashlessJob.newContentUri)
				: '',
			hashlessJob.codemodSetName,
			hashlessJob.codemodName,
		].join(','),
	);

	return hash as JobHash;
};
