import * as t from 'io-ts';
import { buildTypeCodec } from '../../utilities';

const stagedJobCodec = buildTypeCodec({
	hash: t.string,
	label: t.string,
});

export const createPullRequestParamsCodec = buildTypeCodec({
	title: t.string,
	body: t.string,
	baseBranch: t.string,
	targetBranch: t.string,
	remoteUrl: t.string,
	stagedJobs: t.readonlyArray(stagedJobCodec),
	commitMessage: t.string,
	createPullRequest: t.boolean,
	createNewBranch: t.boolean,
});

export const createIssueParamsCodec = buildTypeCodec({
	title: t.string,
	body: t.string,
	remoteUrl: t.string,
});
