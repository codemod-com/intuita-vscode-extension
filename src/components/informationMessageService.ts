import { Uri, window } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export const dependencyNameToGroup: Record<string, 'nextJs' | 'mui'> = {
	next: 'nextJs',
	'@material-ui/core': 'mui',
};

export class InformationMessageService {
	#messageBus: MessageBus;

	constructor(messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(
			MessageKind.showInformationMessage,
			(message) => this.#onShowInformationMessage(message),
		);
	}

	async #onShowInformationMessage(
		message: Message & { kind: MessageKind.showInformationMessage },
	) {
		const storageUri = Uri.joinPath(message.packageSettingsUri, '..');

		const selectedItem = await window.showInformationMessage(
			`Your "${message.dependencyName}" version (${message.dependencyOldVersion}) in "${storageUri.fsPath}" is outdated. Use codemods to upgrade your codebase.`,
			message.dependencyNewVersion
				? `Upgrade to ${message.dependencyNewVersion}`
				: 'Upgrade',
			'No, thanks',
		);

		if (!selectedItem?.startsWith('Upgrade')) {
			return;
		}

		const group = dependencyNameToGroup[message.dependencyName];

		if (!group) {
			return;
		}

		this.#messageBus.publish({
			kind: MessageKind.bootstrapExecutables,
			command: {
				engine: 'node',
				storageUri,
				group,
			},
		});
	}
}
