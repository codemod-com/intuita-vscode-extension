import { Uri } from 'vscode';
import { buildCaseHash } from '../cases/buildCaseHash';
import { CaseManager } from '../cases/caseManager';
import { Case, CaseKind, CaseWithJobHashes } from '../cases/types';
import { Configuration } from '../configuration';
import { Container } from '../container';
import { MoveTopLevelNodeUserCommand } from '../features/moveTopLevelNode/1_userCommandBuilder';
import { buildMoveTopLevelNodeFact } from '../features/moveTopLevelNode/2_factBuilders';
import { buildMoveTopLevelNodeJobs } from '../features/moveTopLevelNode/job';
import { buildFile } from '../files/buildFile';
import { File } from '../files/types';
import { JobHash, JobKind } from '../jobs/types';
import { buildUriHash } from '../uris/buildUriHash';
import { UriHash } from '../uris/types';
import { JobManager } from './jobManager';
import { Message, MessageBus, MessageKind, Trigger } from './messageBus';
import { VSCodeService } from './vscodeService';

export class MoveTopLevelBlocksService {
	protected readonly _hasHadMoveTopLevelBlockJobs = new Set<UriHash>();

	public constructor(
		protected readonly _caseManager: CaseManager,
		protected readonly _jobManager: JobManager,
		protected readonly _messageBus: MessageBus,
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _vscodeService: VSCodeService,
	) {
		_messageBus.subscribe((message) => {
			if (message.kind === MessageKind.externalFileUpdated) {
				setImmediate(() => {
					this._onExternalFileUpdatedMessage(message);
				});
			}
		});
	}

	public onBuildMoveTopLevelBlockCasesAndJobsCommand(
		uri: Uri,
		text: string,
		version: number,
		trigger: Trigger,
	) {
		if (uri.scheme !== 'file') {
			return;
		}

		const uriHash = buildUriHash(uri);
		const fileName = uri.fsPath;

		const userCommand: MoveTopLevelNodeUserCommand = {
			kind: 'MOVE_TOP_LEVEL_NODE',
			fileName,
			fileText: text,
			options: this._configurationContainer.get(),
		};

		const fact = buildMoveTopLevelNodeFact(userCommand);

		if (!fact) {
			return;
		}

		const cases: Case[] = [];

		for (const kase of this._caseManager.getCases()) {
			if (kase.kind !== CaseKind.MOVE_TOP_LEVEL_BLOCKS) {
				continue;
			}

			cases.push(kase);
		}

		const newJobs = buildMoveTopLevelNodeJobs(userCommand, fact);

		const oldJobHashes = this._caseManager.getJobHashes(
			cases.map((kase) => kase.hash),
		);
		const newJobHashes = new Set(newJobs.map(({ hash }) => hash));

		oldJobHashes.forEach((jobHash) => {
			const job = this._jobManager.getJob(jobHash);

			if (job?.kind === JobKind.repairCode) {
				newJobHashes.add(jobHash);
			}
		});

		this._hasHadMoveTopLevelBlockJobs.add(uriHash);

		const file = buildFile(uri, text, version);
		const uriHashFileMap = new Map<UriHash, File>([[uriHash, file]]);

		const caseWithJobHashes: CaseWithJobHashes = {
			hash: buildCaseHash(CaseKind.MOVE_TOP_LEVEL_BLOCKS, null, null),
			kind: CaseKind.MOVE_TOP_LEVEL_BLOCKS,
			code: null,
			node: file.sourceFile,
			jobHashes: newJobHashes,
		};

		const inactiveJobHashes = new Set<JobHash>();

		oldJobHashes.forEach((oldJobHash) => {
			if (newJobHashes.has(oldJobHash)) {
				return;
			}

			inactiveJobHashes.add(oldJobHash);
		});

		this._messageBus.publish({
			kind: MessageKind.upsertCases,
			uriHashFileMap,
			casesWithJobHashes: [caseWithJobHashes],
			jobs: newJobs,
			inactiveDiagnosticHashes: new Set(),
			inactiveJobHashes,
			trigger,
		});
	}

	protected async _onExternalFileUpdatedMessage(
		message: Message & { kind: MessageKind.externalFileUpdated },
	): Promise<void> {
		const uriHash = buildUriHash(message.uri);

		if (!this._hasHadMoveTopLevelBlockJobs.has(uriHash)) {
			return;
		}

		const document = await this._vscodeService.openTextDocument(
			message.uri,
		);

		this.onBuildMoveTopLevelBlockCasesAndJobsCommand(
			message.uri,
			document.getText(),
			document.version,
			'onCommand',
		);
	}
}
