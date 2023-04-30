import * as t from 'io-ts';
import { buildTypeCodec } from '../../utilities';

const stagedJobCodec = buildTypeCodec({
	hash: t.string,
	label: t.string,
});

export const createPullRequestParamsCodec = buildTypeCodec({
	currentBranchName: t.string,
	newBranchName: t.string,
	remoteUrl: t.string,
	stagedJobs: t.readonlyArray(stagedJobCodec),
	commitMessage: t.string,
	createNewBranch: t.boolean,
	pullRequestTitle: t.string,
	pullRequestBody: t.string,
});

export const createIssueParamsCodec = buildTypeCodec({
	title: t.string,
	body: t.string,
	remoteUrl: t.string,
});

export const jobHashArrayCodec = t.readonlyArray(t.string);
