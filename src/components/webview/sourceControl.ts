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
	url: string;
	html_url: string;
};

export class SourceControlService {
	constructor(
		private readonly __configurationService: ConfigurationService,
		private readonly __userAccountStorage: UserAccountStorage,
		private readonly __messageBus: MessageBus,
	) {}

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

		this.__messageBus.publish({ kind: MessageKind.onBeforeCreateIssue });

		const result = await axios.post<CreateIssueResponse>(
			'https://telemetry.intuita.io/sourceControl/github/issues',
			{
				repo: repositoryPath,
				userId: userId,
				body: body,
				title: title,
			},
		);

		this.__messageBus.publish({ kind: MessageKind.onAfterCreateIssue });
		return result.data;
	}
}
