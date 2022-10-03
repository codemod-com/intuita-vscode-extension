import {
	FilePermission,
	Position,
	Range,
	Selection,
	TextEditor,
	TextEditorRevealType,
	Uri,
} from 'vscode';
import { Configuration } from '../configuration';
import { Container } from '../container';
import { destructIntuitaFileSystemUri } from '../destructIntuitaFileSystemUri';
import { JobManager } from './jobManager';
import { Message, MessageBus, MessageKind } from './messageBus';
import { VSCodeService } from './vscodeService';

export class FileService {
	public constructor(
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _jobManager: JobManager,
		protected readonly _messageBus: MessageBus,
		protected readonly _vscodeService: VSCodeService,
	) {
		this._messageBus.subscribe(async (message) => {
			if (message.kind === MessageKind.readingFileFailed) {
				setImmediate(() => this._onReadingFileFailed(message));
			}

			if (message.kind === MessageKind.updateExternalFile) {
				setImmediate(() => this._onUpdateExternalFile(message));
			}
		});
	}

	protected async _onReadingFileFailed(
		message: Message & { kind: MessageKind.readingFileFailed },
	) {
		const destructedUri = destructIntuitaFileSystemUri(message.uri);

		if (!destructedUri) {
			return;
		}

		const text = await this._getText(destructedUri);

		const content = Buffer.from(text);

		const permissions =
			destructedUri.directory === 'files'
				? FilePermission.Readonly
				: null;

		this._messageBus.publish({
			kind: MessageKind.writeFile,
			uri: message.uri,
			content,
			permissions,
		});
	}

	protected async _getText(
		destructedUri: ReturnType<typeof destructIntuitaFileSystemUri>,
	): Promise<string> {
		if (destructedUri.directory === 'jobs') {
			return this._jobManager.executeJob(destructedUri.jobHash, 0).text;
		}

		const fileName = destructedUri.fsPath;
		const uri = Uri.parse(fileName);

		const textDocument = await this._vscodeService.openTextDocument(uri);

		return textDocument.getText();
	}

	protected async _onUpdateExternalFile(
		message: Message & { kind: MessageKind.updateExternalFile },
	) {
		const stringUri = message.uri.toString();

		const textEditors = this._vscodeService
			.getVisibleEditors()
			.filter(({ document }) => {
				return document.uri.toString() === stringUri;
			});

		const textDocuments = this._vscodeService
			.getTextDocuments()
			.filter((document) => {
				return document.uri.toString() === stringUri;
			});

		// TODO if the text editor is missing, just open the document!

		const activeTextEditor = this._vscodeService.getActiveTextEditor();

		const range = new Range(
			new Position(
				message.jobOutput.range[0],
				message.jobOutput.range[1],
			),
			new Position(
				message.jobOutput.range[2],
				message.jobOutput.range[3],
			),
		);

		const { saveDocumentOnJobAccept } = this._configurationContainer.get();

		const changeTextEditor = async (textEditor: TextEditor) => {
			await textEditor.edit((textEditorEdit) => {
				textEditorEdit.replace(range, message.jobOutput.text);
			});

			if (!saveDocumentOnJobAccept) {
				return;
			}

			return textEditor.document.save();
		};

		await Promise.all(textEditors.map(changeTextEditor));

		if (textEditors.length === 0) {
			for (const textDocument of textDocuments) {
				const textEditor = await this._vscodeService
					// TODO we can add a range here
					.showTextDocument(textDocument);

				await changeTextEditor(textEditor);
			}
		}

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

		const allTextDocuments = textEditors
			.map(({ document }) => document)
			.concat(textDocuments);

		if (!allTextDocuments[0]) {
			return;
		}

		this._messageBus.publish({
			kind: MessageKind.externalFileUpdated,
			uri: message.uri,
			text: allTextDocuments[0].getText(),
		});
	}
}
