import { MessageBus, MessageKind } from '../components/messageBus';
import { isNeitherNullNorUndefined } from '../utilities';

interface UserHooks {
	onDryRunCompleted: string | null;
}

export class UserHooksService {
	public constructor(
		private readonly __messageBus: MessageBus,
		private readonly __userHooks: UserHooks,
	) {
		if (__userHooks.onDryRunCompleted !== null) {
			this.__messageBus.subscribe(
				MessageKind.codemodSetExecuted,
				(message) => {
					const changedFilePaths = message.jobs
						.map(({ newContentUri }) => newContentUri?.fsPath)
						.filter(isNeitherNullNorUndefined);

					// @TODO validate command
					const command = this.__userHooks.onDryRunCompleted?.replace(
						'$DRY_RUN_CHANGED_FILES',
						changedFilePaths.join(),
					);
					console.log(command);
				},
			);
		}
	}
}
