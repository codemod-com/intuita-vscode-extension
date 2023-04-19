import * as t from 'io-ts';
import { buildTypeCodec } from '../../utilities';

export const createPullRequestParamsCodec = buildTypeCodec({
	title: t.string,
	body: t.string,
	baseBranch: t.string,
	targetBranch: t.string,
	remoteUrl: t.string,
});

export const createIssueParamsCodec = buildTypeCodec({
	title: t.string,
	body: t.string,
	remoteUrl: t.string,
});
