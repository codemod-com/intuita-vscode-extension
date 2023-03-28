export class AlreadyLinkedError extends Error {
	constructor() {
		super('Already linked to different account');
	}
}


export interface UserAccountStorage {
	getUserAccount(): string | null;
	setUserAccount(value: string | undefined): void;
}

export class UserService {
	constructor(
		private readonly storage: UserAccountStorage, 
	) {}


	getLinkedAccount() {
		return this.storage.getUserAccount();
	}

	unlinkUserIntuitaAccount(): void {
		this.storage.setUserAccount(undefined);
	}

	linkUsersIntuitaAccount(userId: string): void {
		const linkedAccount = this.getLinkedAccount();

		if(linkedAccount && linkedAccount !== userId) {
			throw new AlreadyLinkedError();
		} 

		this.storage.setUserAccount(userId);
	}
}
