import { MessageBus, MessageKind } from '../messageBus';
export class AlreadyLinkedError extends Error {
	constructor() {
		super('Already linked to different account');
	}
}

export class InvalidIntuitaAccount extends Error {}

export interface UserAccountStorage {
	getUserAccount(): string | null;
	setUserAccount(value: string | undefined): void;
}

export class UserService {
	constructor(
		private readonly __storage: UserAccountStorage,
		private readonly __messageBus: MessageBus,
	) {}

	getLinkedAccount() {
		return this.__storage.getUserAccount();
	}

	unlinkUserIntuitaAccount(): void {
		this.__storage.setUserAccount(undefined);
		this.__messageBus.publish({ kind: MessageKind.onAfterUnlinkedAccount });
	}

	linkUsersIntuitaAccount(userId: string): void {
		if (!userId.trim()) {
			throw new InvalidIntuitaAccount();
		}

		const linkedAccount = this.getLinkedAccount();

		if (linkedAccount && linkedAccount !== userId) {
			throw new AlreadyLinkedError();
		}

		this.__storage.setUserAccount(userId);
		this.__messageBus.publish({
			kind: MessageKind.onAfterLinkedAccount,
			account: userId,
		});
	}
}
