import { APIState, API, Repository } from '../../types/git';

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

export class UninitializedError extends Error {}

export class RepositoryService {
	__repo: Repository | null = null;

	constructor(private readonly __gitAPI: API | null) {
		this.__repo = this.__gitAPI?.repositories[0] ?? null;

		this.__gitAPI?.onDidChangeState((state) =>
			this.__onDidChangeState(state),
		);
	}

	private __onDidChangeState(state: APIState): void {
		if (state === 'initialized') {
			this.__repo = this.__gitAPI?.repositories[0] ?? null;
		}
	}

	public async getAllBranches() {
		return this.__repo?.getBranches({ remote: true });
	}

	public async getCurrentBranch() {
		return this.__repo?.state.HEAD;
	}

	public async getWorkingTreeChanges() {
		return this.__repo?.state.workingTreeChanges;
	}

	public async hasChangesToCommit(): Promise<boolean> {
		if (this.__repo === null) {
			return false;
		}

		return (
			this.__repo.state.indexChanges.length !== 0 ||
			this.__repo.state.workingTreeChanges.length !== 0
		);
	}

	public getBranchName(jobHash: string, jobTitle: string) {
		return branchNameFromStr(`${jobTitle}-${jobHash}`);
	}

	public async submitChanges(branchName: string): Promise<void> {
		if (this.__repo === null) {
			return;
		}

		await this.__repo.createBranch(branchName, true);
		await this.__repo.add([]);
		await this.__repo.commit('Test commit', { all: true });
		await this.__repo.push('origin', branchName, true);
	}
}
