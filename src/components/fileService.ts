import { workspace } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export class FileService {
	readonly #messageBus: MessageBus;

	public constructor(readonly messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(MessageKind.updateFile, (message) =>
			this.#onUpdateFile(message),
		);

		this.#messageBus.subscribe(MessageKind.deleteFile, (message) =>
			this.#onDeleteFile(message),
		);
	}

	async #onUpdateFile(
		message: Message & { kind: MessageKind.updateFile },
	) {
		const content = await workspace.fs.readFile(message.contentUri);

		await workspace.fs.writeFile(message.uri, content);

		this.#messageBus.publish({
			kind: MessageKind.deleteFile,
			uri: message.contentUri,
		});
	}

	async #onDeleteFile(
		message: Message & { kind: MessageKind.deleteFile },
	) {
		await workspace.fs.delete(message.uri, { recursive: false, useTrash: false });

		console.log(`DELETED ${message.uri}`);
	}
}
