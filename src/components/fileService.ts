import { dirname } from 'node:path';
import { Uri, workspace } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';

export class FileService {
	readonly #messageBus: MessageBus;

	public constructor(readonly messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(MessageKind.createFile, (message) =>
			this.#onCreateFile(message),
		);

		this.#messageBus.subscribe(MessageKind.updateFile, (message) =>
			this.#onUpdateFile(message),
		);

		this.#messageBus.subscribe(MessageKind.moveFile, (message) =>
			this.#onMoveFile(message),
		);

		this.#messageBus.subscribe(MessageKind.deleteFiles, (message) =>
			this.#onDeleteFile(message),
		);
	}

	async #onCreateFile(message: Message & { kind: MessageKind.createFile }) {
		const content = await workspace.fs.readFile(message.newContentUri);

		const directory = dirname(message.newUri.fsPath);

		await workspace.fs.createDirectory(Uri.file(directory));

		await workspace.fs.writeFile(message.newUri, content);

		if (message.deleteNewContentUri) {
			this.#messageBus.publish({
				kind: MessageKind.deleteFiles,
				uris: [message.newContentUri],
			});
		}
	}

	async #onUpdateFile(message: Message & { kind: MessageKind.updateFile }) {
		const content = await workspace.fs.readFile(message.contentUri);

		await workspace.fs.writeFile(message.uri, content);

		this.#messageBus.publish({
			kind: MessageKind.deleteFiles,
			uris: [message.contentUri],
		});
	}

	async #onMoveFile(message: Message & { kind: MessageKind.moveFile }) {
		const content = await workspace.fs.readFile(message.newContentUri);

		const directory = dirname(message.newUri.fsPath);

		await workspace.fs.createDirectory(Uri.file(directory));

		await workspace.fs.writeFile(message.newUri, content);

		this.#messageBus.publish({
			kind: MessageKind.deleteFiles,
			uris: [message.oldUri, message.newContentUri],
		});
	}

	async #onDeleteFile(message: Message & { kind: MessageKind.deleteFiles }) {
		for (const uri of message.uris) {
			await workspace.fs.delete(uri, {
				recursive: false,
				useTrash: false,
			});
		}
	}
}
