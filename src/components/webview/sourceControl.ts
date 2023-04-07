import axios from 'axios';
import { MessageBus, MessageKind } from '../messageBus';
export class NotFoundRepositoryPath extends Error {}
export class NotFoundIntuitaAccount extends Error {}
interface ConfigurationService {
	getConfiguration(): { repositoryPath: string | undefined };
}
interface UserAccountStorage {
	getUserAccount(): string | null;
}

type CreateIssueResponse = {
	html_url: string;
};

type CreatePRResponse = {
	html_url: string;
};

export class SourceControlService {
	constructor(
		private readonly __configurationService: ConfigurationService,
		private readonly __userAccountStorage: UserAccountStorage,
		private readonly __messageBus: MessageBus,
	) {}

	async createPR(params: {
		title: string;
		body: string;
		baseBranch: string;
		targetBranch: string;
	}) {
		// @TODO repository path is responsibility of RepositoryService
		const { repositoryPath } =
			this.__configurationService.getConfiguration();

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
			'https://codemod-studio.vercel.app/sourceControl/github/pulls',
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
		const { repositoryPath } =
			this.__configurationService.getConfiguration();

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
			'https://codemod-studio.vercel.app/sourceControl/github/issues',
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
}
