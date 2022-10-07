import {
	CodeAction,
	CodeActionKind,
	CodeActionProvider,
	Command,
	ProviderResult,
	Range,
	Selection,
	TextDocument,
} from 'vscode';
import { JobManager } from './jobManager';
import { buildFileUri, buildJobUri } from './intuitaFileSystem';
import { IntuitaPosition, IntuitaRange } from '../utilities';
import { buildFileNameHash } from '../features/moveTopLevelNode/fileNameHash';
import { calculateCharacterDifference } from '../features/moveTopLevelNode/job';

const buildIntuitaPosition = (range: Range | Selection): IntuitaPosition => [
	range.start.line,
	range.start.character,
];

const isRangeWithinPosition = (
	range: IntuitaRange,
	position: IntuitaPosition,
): boolean =>
	range[0] <= position[0] &&
	range[2] >= position[0] &&
	range[1] <= position[1] &&
	range[3] >= position[1];

export class IntuitaCodeActionProvider implements CodeActionProvider {
	public constructor(protected readonly _jobManager: JobManager) {}

	provideCodeActions(
		document: TextDocument,
		range: Range | Selection,
	): ProviderResult<(Command | CodeAction)[]> {
		const fileNameHash = buildFileNameHash(document.fileName);

		const position = buildIntuitaPosition(range);

		const codeActions = this._jobManager
			.getFileJobs(fileNameHash)
			.filter(({ range }) => isRangeWithinPosition(range, position))
			.flatMap((job) => {
				const characterDifference = calculateCharacterDifference(
					job,
					position,
				);

				const quickFixCodeAction = new CodeAction(
					job.title,
					CodeActionKind.QuickFix,
				);

				quickFixCodeAction.command = {
					title: job.title,
					command: 'intuita.acceptJob',
					arguments: [job.hash, characterDifference],
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
