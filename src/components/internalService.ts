import { FilePermission, Uri, workspace } from "vscode";
import { destructIntuitaFileSystemUri } from "../destructIntuitaFileSystemUri";
import { assertsNeitherNullOrUndefined } from "../utilities";
import { JobManager } from "./jobManager";
import { Message, MessageBus, MessageKind } from "./messageBus";

export class InternalService {
    public constructor(
        protected readonly _jobManager: JobManager,
        protected readonly _messageBus: MessageBus,
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

		const fileName =
			destructedUri.directory === 'files'
				? destructedUri.fsPath
				: this._jobManager.getFileNameFromJobHash(destructedUri.jobHash);

		if (!fileName) {
			console.debug('Could not get the file name from the provided URI');

			return;
		}

        // replace with a _openTextDocument dependency
		const textDocument = await workspace.openTextDocument(
			Uri.parse(fileName),
		);
		
        // move text into a function?
        let text = textDocument.getText();

		if (destructedUri.directory === 'jobs') {
			const result = this._jobManager.executeJob(destructedUri.jobHash, 0);

			text = result.text;
		}

		assertsNeitherNullOrUndefined(text);

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
}