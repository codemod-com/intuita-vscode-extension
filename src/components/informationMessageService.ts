import { Uri, window } from "vscode";
import { Message, MessageBus, MessageKind } from "./messageBus";

export class InformationMessageService {
    #messageBus: MessageBus;

    constructor(
        messageBus: MessageBus,
    ) {
        this.#messageBus = messageBus;

        this.#messageBus.subscribe(MessageKind.showInformationMessage, (message) => this.#onShowInformationMessage(message));
    }

    async #onShowInformationMessage(message: Message & { kind: MessageKind.showInformationMessage }) {
        const selectedItem = await window.showInformationMessage(
            `Your "${message.dependencyName}" version (${message.dependencyOldVersion}) is outdated. Use codemods to upgrade your codebase.`,
            `Upgrade to ${message.dependencyNewVersion}`,
            "No, thanks"
        );

        if (selectedItem === "No, thanks") {
            return;
        }

        const storageUri = Uri.joinPath(message.packageSettingsUri, '..');

        this.#messageBus.publish({
            kind: MessageKind.bootstrapExecutables,
            command: {
                engine: 'node',
                storageUri,
                group: 'nextJs',
            },
        });
    }
}