import { Memento } from 'vscode';

export class GlobalStateTokenStorage {
	constructor(private readonly __globalState: Memento) {}

	getAccessToken(): string | null {
		const accessToken = this.__globalState.get('accessToken');
		return typeof accessToken === 'string' ? accessToken : null;
	}

	setAccessToken(accessToken: string | undefined): void {
		this.__globalState.update('accessToken', accessToken);
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
		return this.__storage.getAccessToken();
	}

	unlinkUserIntuitaAccount(): void {
		this.__storage.setAccessToken(undefined);
	}

	linkUserIntuitaAccount(accessToken: string): void {
		const linkedToken = this.getLinkedToken();

		if (linkedToken !== null && linkedToken !== accessToken) {
			throw new AlreadyLinkedError();
		}

		this.__storage.setAccessToken(accessToken);
	}
}
