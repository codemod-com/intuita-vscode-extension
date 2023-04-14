import axios from 'axios';
import { MessageBus, MessageKind } from '../messageBus';
import { RepositoryService } from './repository';
export class NotFoundRepositoryPath extends Error {}
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

type Assignee = Readonly<{
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	html_url: string;
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
	}) {
		const repositoryPath = this.__repositoryService.getRepositoryPath();

		if (!repositoryPath) {
			throw new NotFoundRepositoryPath();
		}

		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount();
		}

		const { title, body, baseBranch, targetBranch } = params;
		this.__messageBus.publish({ kind: MessageKind.beforePRCreated });

		const result = await axios.post<PullRequest>(
			'https://telemetry.intuita.io/sourceControl/github/pulls',
			{
				repo: repositoryPath,
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

	async createIssue(params: { title: string; body: string }) {
		const repositoryPath = this.__repositoryService.getRepositoryPath();

		if (!repositoryPath) {
			throw new NotFoundRepositoryPath();
		}

		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount();
		}

		const { title, body } = params;

		this.__messageBus.publish({ kind: MessageKind.beforeIssueCreated });

		const result = await axios.post<CreateIssueResponse>(
			'https://telemetry.intuita.io/sourceControl/github/issues',
			{
				repo: repositoryPath,
				userId: userId,
				body: body,
				title: title,
			},
		);

		this.__messageBus.publish({ kind: MessageKind.afterIssueCreated });
		return result.data;
	}

	async getPullRequests() {
		const repositoryPath = this.__repositoryService.getRepositoryPath();

		if (!repositoryPath) {
			throw new NotFoundRepositoryPath();
		}

		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount();
		}

		const query = new URLSearchParams({ userId, repo: repositoryPath });

		const result = await axios.get<PullRequest[]>(
			`https://telemetry.intuita.io/sourceControl/github/pulls?${query.toString()}`,
		);

		return result.data;
	}

	async getPRForBranch(branchName: string): Promise<PullRequest | null> {
		const PRList = await this.getPullRequests();
		return PRList.find((pr) => pr.head.ref === branchName) ?? null;
	}


	async getAssignees(): Promise<Assignee[]> {
		const repositoryPath = this.__repositoryService.getRepositoryPath();

		if (!repositoryPath) {
			throw new NotFoundRepositoryPath();
		}

		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount();
		}

		const result = await axios.get<Assignee[]>(
			`https://telemetry.intuita.io/sourceControl/github/assignees`,
		);

		return result.data;
	}
}
