import { FilePermission, Uri, workspace } from 'vscode';
import { destructIntuitaFileSystemUri } from '../destructIntuitaFileSystemUri';
import { Message, MessageBus, MessageKind } from './messageBus';

export class FileService {
	readonly #messageBus: MessageBus;

	public constructor(readonly messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(async (message) => {
			if (message.kind === MessageKind.readingFileFailed) {
				setImmediate(() => this.#onReadingFileFailed(message));
			}

			if (message.kind === MessageKind.updateExternalFile) {
				setImmediate(() => this.#onUpdateExternalFile(message));
			}
		});
	}

	async #onReadingFileFailed(
		message: Message & { kind: MessageKind.readingFileFailed },
	) {
		const destructedUri = destructIntuitaFileSystemUri(message.uri);

		if (!destructedUri) {
			return;
		}

		const fileName = destructedUri.fsPath;
		const uri = Uri.parse(fileName);

		const content = await workspace.fs.readFile(uri);

		const permissions =
			destructedUri.directory === 'files'
				? FilePermission.Readonly
				: null;

		this.#messageBus.publish({
			kind: MessageKind.writeFile,
			uri: message.uri,
			content,
			permissions,
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
