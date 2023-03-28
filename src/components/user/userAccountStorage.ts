import * as vscode from 'vscode';

export class GlobalStateAccountStorage {
	constructor(private readonly globalState: vscode.Memento) {}

	getUserAccount() {
		const userAccount = this.globalState.get('userAccount');
		return typeof userAccount === 'string' ? userAccount : null;
	}

	setUserAccount(userAccount: string | undefined) {
		this.globalState.update('userAccount', userAccount);
	}
}
