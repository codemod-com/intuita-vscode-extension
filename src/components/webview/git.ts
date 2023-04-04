import { APIState } from '../../../git';
import { API, Repository } from '../../../git';

const branchNameFromStr = (str: string): string => {
	let branchName = str.toLowerCase();

	branchName = branchName.replace(/\s+/g, '-');

	branchName = branchName.replace(/[^a-z0-9-]/g, '-');

	branchName = branchName.replace(/--+/g, '-');

	branchName = branchName.replace(/^-+|-+$/g, '');

	if (branchName.length > 63) {
		branchName = branchName.substr(0, 63);
	}

	if (!/^[a-z0-9]/.test(branchName)) {
		branchName = 'x-' + branchName;
	}

	return branchName;
};

export class UninitializedError extends Error {};

export class Git {
	__repo: Repository | null = null;

	constructor(private readonly __gitAPI: API) {
		this.__gitAPI.onDidChangeState(this.onDidChangeState);
	}

  private onDidChangeState = (state: APIState) => {
    if(state === 'initialized') {
      this.__repo = this.__gitAPI.repositories[0] ?? null;
    }
  }

  private ensureRepoInitialized(this: Git): asserts this is { __repo: Repository} {
    if(!this.__repo) {
      throw new UninitializedError();
    }
  }

  private getBranch = async (name: string) => {
    this.ensureRepoInitialized();

    return  this.__repo.getBranch(name);
  }

  private getRemotes = async () => {
    this.ensureRepoInitialized()
    return this.__repo.state.remotes;
  } 

	private commitAll = async(message: string,)  =>{
    this.ensureRepoInitialized();
		this.__repo.add([]);
		return this.__repo.commit(message, { all: true });
	}

  private push  =  async() => {
    this.ensureRepoInitialized();
    this.__repo.push()
  }

  public  submitChanges = async(jobHash: string, jobTitle: string) => {
    this.ensureRepoInitialized();
    
    const branchName = branchNameFromStr(`${jobTitle}-${jobHash}`);
  
    this.__repo.createBranch(branchName, true);
    this.commitAll("Test commit");

    const remotes = await this.getRemotes();

    // const origin = remotes.find(remote => remote.name === 'origin');

    this.__repo.push('origin', branchName, true);
  }
}
