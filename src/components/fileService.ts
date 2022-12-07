import { workspace } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export class FileService {
	readonly #messageBus: MessageBus;

	public constructor(readonly messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(async (message) => {
			if (message.kind === MessageKind.updateExternalFile) {
				setImmediate(() => this.#onUpdateExternalFile(message));
			}
		});
	}

	async #onUpdateExternalFile(
		message: Message & { kind: MessageKind.updateExternalFile },
	) {
		// TODO we could use a stream here
		const content = await workspace.fs.readFile(message.contentUri);

		await workspace.fs.writeFile(message.uri, content);
	}
}
