import { Memento } from 'vscode';

export class GlobalStateTokenStorage {
	constructor(private readonly __globalState: Memento) {}

	getUserToken() {
		const clerkToken = this.__globalState.get('userToken');
		return typeof clerkToken === 'string' ? clerkToken : null;
	}

	setUserToken(clerkToken: string | undefined) {
		this.__globalState.update('userToken', clerkToken);
	}
}

export class AlreadyLinkedError extends Error {
	constructor() {
		super('Already linked to different account');
	}
}

export interface IGlobalStateTokenStorage {
	getUserToken(): string | null;
	setUserToken(value: string | undefined): void;
}

export class UserService {
	constructor(private readonly __storage: IGlobalStateTokenStorage) {}

	getLinkedToken() {
		return this.__storage.getUserToken();
	}

	unlinkUserIntuitaAccount(): void {
		this.__storage.setUserToken(undefined);
	}

	linkUserIntuitaAccount(accessToken: string): void {
		const linkedToken = this.getLinkedToken();

		if (linkedToken !== null && linkedToken !== accessToken) {
			throw new AlreadyLinkedError();
		}

		this.__storage.setUserToken(accessToken);
	}
}
