import { FilePermission, TextDocument, Uri } from "vscode";
import { destructIntuitaFileSystemUri } from "../destructIntuitaFileSystemUri";
import { JobManager } from "./jobManager";
import { Message, MessageBus, MessageKind } from "./messageBus";

export class FileService {
    public constructor(
        protected readonly _jobManager: JobManager,
        protected readonly _messageBus: MessageBus,
        protected readonly _openTextDocument: (uri: Uri) => Promise<TextDocument> 
    ) {
        this._messageBus.subscribe(async (message) => {
            if (message.kind === MessageKind.readingFileFailed) {
                setImmediate(() => this._onReadingFileFailed(message));
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
            return this._jobManager
                .executeJob(destructedUri.jobHash, 0)
                .text;
        }

        const fileName = destructedUri.fsPath;
        const uri = Uri.parse(fileName);

        const textDocument = await this._openTextDocument(uri);

        return textDocument.getText();        
    }
}