import { APIState, API, Repository, Branch, Change } from '../../types/git';
import { MessageBus, MessageKind } from '../messageBus';

const branchNameFromStr = (str: string): string => {
	let branchName = str
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');

	if (branchName.length > 63) {
		branchName = branchName.substr(0, 63);
	}

	if (!/^[a-z0-9]/.test(branchName)) {
		branchName = 'x-' + branchName;
	}

	return branchName;
};

export class RepositoryService {
	__repo: Repository | null = null;

	constructor(
		private readonly __gitAPI: API | null,
		private readonly __messageBus: MessageBus,
	) {
		this.__repo = this.__gitAPI?.repositories[0] ?? null;

		this.__gitAPI?.onDidChangeState((state) =>
			this.__onDidChangeState(state),
		);
	}

	private __onDidChangeState(state: APIState): void {
		if (state === 'initialized') {
			this.__repo = this.__gitAPI?.repositories[0] ?? null;

			const repositoryPath = this.getRepositoryPath();

			this.__messageBus.publish({
				kind: MessageKind.repositoryPathChanged,
				repositoryPath,
			});
		}
	}

	public async getAllBranches() {
		return this.__repo?.getBranches({ remote: true });
	}

	public getCurrentBranch(): Branch | null {
		return this.__repo?.state.HEAD ?? null;
	}

	public getWorkingTreeChanges(): ReadonlyArray<Change> | null {
		return this.__repo?.state.workingTreeChanges ?? null;
	}

	public hasChangesToCommit(): boolean {
		if (this.__repo === null) {
			return false;
		}

		return (
			this.__repo.state.indexChanges.length !== 0 ||
			this.__repo.state.workingTreeChanges.length !== 0
		);
	}

	public getBranchName(jobHash: string, jobTitle: string): string {
		return branchNameFromStr(`${jobTitle}-${jobHash}`);
	}

	public async getBranch(branchName: string): Promise<Branch | null> {
		if (this.__repo === null) {
			return null;
		}

		try {
			return this.__repo.getBranch(branchName);
		} catch (e) {
			return null;
		}
	}

	public async isBranchExists(branchName: string): Promise<boolean> {
		return await this.getBranch(branchName) !== null
	}

	public async submitChanges(branchName: string): Promise<void> {
		if (this.__repo === null) {
			return;
		}

		const branchAlreadyExists = await this.isBranchExists(branchName);

		if(branchAlreadyExists) {
			await this.__repo.checkout(branchName);
		} else {
			await this.__repo.createBranch(branchName, true);
		}

		await this.__repo.add([]);
		await this.__repo.commit('Test commit', { all: true });
		await this.__repo.push('origin', branchName, true);
	}

	public getRepositoryPath(): string | null {
		return (
			this.__gitAPI?.repositories[0]?.state.remotes[0]?.pushUrl ?? null
		);
	}
}
