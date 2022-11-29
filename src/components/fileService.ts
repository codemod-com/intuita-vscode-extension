import {
	FilePermission,
	Uri,
	workspace,
} from 'vscode';
import { destructIntuitaFileSystemUri } from '../destructIntuitaFileSystemUri';
import { Message, MessageBus, MessageKind } from './messageBus';
import { VSCodeService } from './vscodeService';

export class FileService {
	readonly #messageBus: MessageBus;
	readonly #vscodeService: VSCodeService;

	public constructor(
		readonly messageBus: MessageBus,
		readonly vscodeService: VSCodeService,
	) {
		this.#messageBus = messageBus;
		this.#vscodeService = vscodeService;

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

		const text = await this.#getText(destructedUri);

		const content = Buffer.from(text);

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

	async #getText(
		destructedUri: ReturnType<typeof destructIntuitaFileSystemUri>,
	): Promise<string> {
		if (destructedUri.directory === 'jobs') {
			return ''; // TODO remove this case
		}

		const fileName = destructedUri.fsPath;
		const uri = Uri.parse(fileName);

		const textDocument = await this.#vscodeService.openTextDocument(uri);

		return textDocument.getText();
	}

	async #onUpdateExternalFile(
		message: Message & { kind: MessageKind.updateExternalFile },
	) {
		// TODO we could use a stream here
		const content = await workspace.fs.readFile(message.uri);

		workspace.fs.writeFile(message.uri, content);
	}
}
