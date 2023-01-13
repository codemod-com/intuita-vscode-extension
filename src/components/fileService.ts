import { workspace } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export class FileService {
	readonly #messageBus: MessageBus;

	public constructor(readonly messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(MessageKind.updateFile, (message) =>
			this.#onUpdateFile(message),
		);

		this.#messageBus.subscribe(MessageKind.deleteFiles, (message) =>
			this.#onDeleteFile(message),
		);
	}

	async #onUpdateFile(message: Message & { kind: MessageKind.updateFile }) {
		const content = await workspace.fs.readFile(message.contentUri);

		await workspace.fs.writeFile(message.uri, content);

		this.#messageBus.publish({
			kind: MessageKind.deleteFiles,
			uris: [message.contentUri],
		});
	}

	async #onDeleteFile(message: Message & { kind: MessageKind.deleteFiles }) {
		for (const uri of message.uris) {
			await workspace.fs.delete(uri, {
				recursive: false,
				useTrash: false,
			});

			console.log(`DELETED ${uri}`);
		}
	}
}
