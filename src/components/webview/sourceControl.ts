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

type CreatePRResponse = {
	html_url: string;
};

type ListPRResponse = {
	html_url: string;
	head: {
		ref: string;
	};
}[];

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

		const result = await axios.post<CreatePRResponse>(
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

	async listPR() {
		const repositoryPath = this.__repositoryService.getRepositoryPath();

		if (!repositoryPath) {
			throw new NotFoundRepositoryPath();
		}

		const userId = this.__userAccountStorage.getUserAccount();

		if (!userId) {
			throw new NotFoundIntuitaAccount();
		}

		const result = await axios.get<ListPRResponse>(
			'https://telemetry.intuita.io/sourceControl/github/pulls',
		);

		return result.data;
	}

	async getPRForBranch(branchName: string) {
		const PRList = await this.listPR();
		return PRList.find((pr) => pr.head.ref === branchName);
	}
}
