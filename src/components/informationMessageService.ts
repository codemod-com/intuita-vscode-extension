import { Uri, window } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export const dependencyNameToGroup: Record<string, 'nextJs' | 'mui'> = {
	next: 'nextJs',
	'@material-ui/core': 'mui',
};

export class InformationMessageService {
	#messageBus: MessageBus;
	#getStorageUri: () => Uri | null;

	constructor(
		messageBus: MessageBus,
		getStorageUri: () => Uri | null,
	) {
		this.#messageBus = messageBus;
		this.#getStorageUri = getStorageUri;

		this.#messageBus.subscribe(
			MessageKind.showInformationMessage,
			(message) => this.#onShowInformationMessage(message),
		);
	}

	async #onShowInformationMessage(
		message: Message & { kind: MessageKind.showInformationMessage },
	) {
		const storageUri = this.#getStorageUri();

		if (!storageUri) {
            return;
        }

		const uri = Uri.joinPath(message.packageSettingsUri, '..');

		const selectedItem = await window.showInformationMessage(
			`Your "${message.dependencyName}" version (${message.dependencyOldVersion}) in "${uri.fsPath}" is outdated. Use codemods to upgrade your codebase.`,
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
				uri,
				group,
			},
		});
	}
}
