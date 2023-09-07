import { Memento } from 'vscode';

export class GlobalStateTokenStorage {
	constructor(private readonly __globalState: Memento) {}

	getUserToken(): string | null {
		const accessToken = this.__globalState.get('userToken');
		return typeof accessToken === 'string' ? accessToken : null;
	}

	setUserToken(accessToken: string | undefined): void {
		this.__globalState.update('userToken', accessToken);
	}
}

export class AlreadyLinkedError extends Error {
	constructor() {
		super('Already linked to different account');
	}
}

export class UserService {
	constructor(private readonly __storage: GlobalStateTokenStorage) {}

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
