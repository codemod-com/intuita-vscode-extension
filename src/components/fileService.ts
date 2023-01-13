import { workspace } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export class FileService {
	readonly #messageBus: MessageBus;

	public constructor(readonly messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(MessageKind.updateFile, (message) =>
			this.#onUpdateFile(message),
		);
	}

	async #onUpdateFile(
		message: Message & { kind: MessageKind.updateFile },
	) {
		// TODO we could use a stream here
		const content = await workspace.fs.readFile(message.contentUri);

		await workspace.fs.writeFile(message.uri, content);
	}
}
