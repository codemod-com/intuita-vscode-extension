import {
	CodeAction,
	CodeActionKind,
	CodeActionProvider,
	Command,
	ProviderResult,
	TextDocument,
} from 'vscode';
import { JobManager } from './jobManager';
import { buildFileUri, buildJobUri } from './intuitaFileSystem';
import { buildUriHash } from '../uris/buildUriHash';

export class IntuitaCodeActionProvider implements CodeActionProvider {
	#jobManager: JobManager;
	public constructor(jobManager: JobManager) {
		this.#jobManager = jobManager;
	}

	provideCodeActions(
		document: TextDocument,
	): ProviderResult<(Command | CodeAction)[]> {
		const uri = buildUriHash(document.uri);

		const codeActions = Array.from(
			this.#jobManager.getFileJobs(uri),
		).flatMap((job) => {
			const quickFixCodeAction = new CodeAction(
				job.title,
				CodeActionKind.QuickFix,
			);

			quickFixCodeAction.command = {
				title: job.title,
				command: 'intuita.acceptJob',
				arguments: [job.hash, 0],
			};

			const title = `Show the difference: ${job.title}`;

			const showDifferenceCodeAction = new CodeAction(
				title,
				CodeActionKind.Empty,
			);

			showDifferenceCodeAction.command = {
				title,
				command: 'vscode.diff',
				arguments: [buildFileUri(document.uri), buildJobUri(job)],
			};

			return [quickFixCodeAction, showDifferenceCodeAction];
		});

		return Promise.resolve(codeActions);
	}
}
