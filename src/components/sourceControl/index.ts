import axios from 'axios';
import { MessageBus, MessageKind } from '../messageBus';
import { RepositoryService } from '../webview/repository';
export class NotFoundIntuitaAccount extends Error {}

interface UserAccountStorage {
	getUserAccount(): string | null;
}

type CreateIssueResponse = {
	html_url: string;
};

type PullRequest = Readonly<{
	html_url: string;
	head: {
		ref: string;
	};
	base: {
		ref: string;
	};
}>;

export class SourceControlService {
	constructor(
		private readonly __userAccountStorage: UserAccountStorage,
		private readonly __messageBus: MessageBus,
		private readonly __repositoryService: RepositoryService,
	) {}

	async createPR(params: {
		title: string;
		body: string;
		baseBranch: string;
		targetBranch: string;
		remoteUrl: string;
	}) {
		const userId = this.__userAccountStorage.getUserAccount();
		if (!userId) {
			throw new NotFoundIntuitaAccount('Intuita account not found');
		}

		const { title, body, baseBranch, targetBranch, remoteUrl } = params;
		this.__messageBus.publish({ kind: MessageKind.beforePRCreated });

		const result = await axios.post<PullRequest>(
			'https://telemetry.intuita.io/sourceControl/github/pulls',
			{
				repo: remoteUrl,
				userId: userId,
				body: body,
				title: title,
				head: targetBranch,
				base: baseBranch,
			},
		);

		this.__messageBus.publish({ kind: MessageKind.afterIssueCreated });
		return result.data;
	}

	async createIssue(params: {
		title: string;
		body: string;
		remoteUrl: string;
	}) {
		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount('Intuita account not found');
		}

		const { title, body, remoteUrl } = params;

		this.__messageBus.publish({ kind: MessageKind.beforeIssueCreated });

		const result = await axios.post<CreateIssueResponse>(
			'https://telemetry.intuita.io/sourceControl/github/issues',
			{
				repo: remoteUrl,
				userId: userId,
				body: body,
				title: title,
			},
		);

		this.__messageBus.publish({ kind: MessageKind.afterIssueCreated });
		return result.data;
	}

	async listPR(remoteUrl: string) {
		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount('Intuita account not found');
		}

		const query = new URLSearchParams({ userId, repo: remoteUrl });

		const result = await axios.get<PullRequest[]>(
			`https://telemetry.intuita.io/sourceControl/github/pulls?${query.toString()}`,
		);

		return result.data;
	}

	async getPRForBranch(
		branchName: string,
		remoteUrl: string,
	): Promise<PullRequest | null> {
		const PRList = await this.listPR(remoteUrl);
		return PRList.find((pr) => pr.head.ref === branchName) ?? null;
	}

	async getUnsavedBranches() {
		const remoteUrl = this.__repositoryService.getRemoteUrl();

		if (!remoteUrl) {
			throw new Error('Unable to detect the git remote URI');
		}

		const stackedBranches = this.__repositoryService.getStackedBranches();
		const stackedBranchesWithoutBase = stackedBranches.slice(1);

		const pullRequests = await this.listPR(remoteUrl);

		const savedBranches = pullRequests.map(
			(pullRequest) => pullRequest.head.ref,
		);

		return stackedBranchesWithoutBase.filter(
			(branchName) => !savedBranches.includes(branchName),
		);
	}
}
