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
	constructor(private readonly __storage: UserAccountStorage) {}

	getLinkedAccount() {
		return this.__storage.getUserAccount();
	}

	unlinkUserIntuitaAccount(): void {
		this.__storage.setUserAccount(undefined);
	}

	linkUsersIntuitaAccount(userId: string): void {
		const linkedAccount = this.getLinkedAccount();

		if (linkedAccount && linkedAccount !== userId) {
			throw new AlreadyLinkedError();
		}

		this.__storage.setUserAccount(userId);
	}
}
