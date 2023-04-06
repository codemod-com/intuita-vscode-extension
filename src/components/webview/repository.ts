import { APIState, API, Repository } from '../../types/git';
import { assertsNeitherNullOrUndefined } from '../../utilities';

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

	constructor(private readonly __gitAPI: API) {
		this.__gitAPI.onDidChangeState(this.__onDidChangeState);
	}

	private __onDidChangeState = (state: APIState) => {
		if (state === 'initialized') {
			this.__repo = this.__gitAPI.repositories[0] ?? null;
		}
	};

	public async getAllBranches() {
		// @TODO instead of this checks in each methods, just init repo before creating service...
		// repo service should not exist without repo...
		assertsNeitherNullOrUndefined(this.__repo);

		return this.__repo.getBranches({ remote: true });
	}

	public async getCurrentBranch() {
		assertsNeitherNullOrUndefined(this.__repo);

		return this.__repo.state.HEAD;
	}

	public async getWorkingTreeChanges() {
		assertsNeitherNullOrUndefined(this.__repo);

		return this.__repo.state.workingTreeChanges;
	}

	public async hasWorkingTreeChanges() {
		const changes = await this.getWorkingTreeChanges();

		return changes.length !== 0;
	}

	public getBranchName(jobHash: string, jobTitle: string) {
		return branchNameFromStr(`${jobTitle}-${jobHash}`);
	}

	public async submitChanges(branchName: string) {
		assertsNeitherNullOrUndefined(this.__repo);

		await this.__repo.createBranch(branchName, true);
		await this.__repo.add([]);
		await this.__repo.commit('Test commit', { all: true });
		await this.__repo.push('origin', branchName, true);
	}
}
