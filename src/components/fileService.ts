import {
	FilePermission,
	Position,
	Range,
	Selection,
	TextEditorRevealType,
	Uri,
	workspace,
	WorkspaceEdit,
} from 'vscode';
import { Configuration } from '../configuration';
import { Container } from '../container';
import { destructIntuitaFileSystemUri } from '../destructIntuitaFileSystemUri';
import { JobManager } from './jobManager';
import { Message, MessageBus, MessageKind } from './messageBus';
import { VSCodeService } from './vscodeService';

export class FileService {
	readonly #configurationContainer: Container<Configuration>;
	readonly #jobManager: JobManager;
	readonly #messageBus: MessageBus;
	readonly #vscodeService: VSCodeService;
	readonly #uriStringToVersionMap: Map<string, number>;

	public constructor(
		readonly configurationContainer: Container<Configuration>,
		readonly jobManager: JobManager,
		readonly messageBus: MessageBus,
		readonly vscodeService: VSCodeService,
		readonly uriStringToVersionMap: Map<string, number>,
	) {
		this.#configurationContainer = configurationContainer;
		this.#jobManager = jobManager;
		this.#messageBus = messageBus;
		this.#vscodeService = vscodeService;
		this.#uriStringToVersionMap = uriStringToVersionMap;

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
			return this.#jobManager.executeJob(destructedUri.jobHash, 0).text;
		}

		const fileName = destructedUri.fsPath;
		const uri = Uri.parse(fileName);

		const textDocument = await this.#vscodeService.openTextDocument(uri);

		return textDocument.getText();
	}

	async #onUpdateExternalFile(
		message: Message & { kind: MessageKind.updateExternalFile },
	) {
		const stringUri = message.uri.toString();

		const document = await this.#vscodeService.openTextDocument(
			message.uri,
		);

		const { lineCount } = document;

		const range = new Range(
			new Position(0, 0),
			new Position(
				lineCount !== 0 ? lineCount - 1 : 0,
				lineCount !== 0
					? document.lineAt(lineCount - 1).range.end.character
					: 0,
			),
		);

		const workspaceEdit = new WorkspaceEdit();

		workspaceEdit.replace(message.uri, range, message.jobOutput.text);

		this.#uriStringToVersionMap.set(stringUri, document.version + 1);

		await workspace.applyEdit(workspaceEdit);

		const { saveDocumentOnJobAccept } = this.#configurationContainer.get();

		if (saveDocumentOnJobAccept) {
			await document.save();
		}

		const activeTextEditor = this.#vscodeService.getActiveTextEditor();

		if (activeTextEditor?.document.uri.toString() === stringUri) {
			const position = new Position(
				message.jobOutput.position[0],
				message.jobOutput.position[1],
			);

			const selection = new Selection(position, position);

			activeTextEditor.selections = [selection];

			activeTextEditor.revealRange(
				new Range(position, position),
				TextEditorRevealType.AtTop,
			);
		}

		this.#messageBus.publish({
			kind: MessageKind.externalFileUpdated,
			uri: message.uri,
		});
	}
}
