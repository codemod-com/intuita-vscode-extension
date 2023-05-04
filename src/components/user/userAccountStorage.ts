import * as vscode from 'vscode';

export class GlobalStateAccountStorage {
	constructor(private readonly __globalState: vscode.Memento) {}

	getUserAccount() {
		const userAccount = this.__globalState.get('userAccount');
		return typeof userAccount === 'string' ? userAccount : null;
	}

	setUserAccount(userAccount: string | undefined) {
		this.__globalState.update('userAccount', userAccount);
	}
}
