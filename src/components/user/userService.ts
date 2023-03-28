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

	// async getOAuthAccessToken(userId: string, provider: string): Promise<string> {
	// 	try {
	// 		const result = await this.userRepository.getOAuthAccessToken(userId, provider);

	// 		if(!result[0]) throw new Error('Missing OAuth token for provider:' + provider);
			
	// 		return result[0].token;

	// 	} catch(e) {
	// 		throw new Error('Unable to get OAuthToken:' + (e as Error).message);
	// 	}
	// }
}
