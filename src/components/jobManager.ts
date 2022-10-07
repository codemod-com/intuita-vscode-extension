import {
	buildFileNameHash,
	FileNameHash,
} from '../features/moveTopLevelNode/fileNameHash';
import { JobHash } from '../features/moveTopLevelNode/jobHash';
import {
	assertsNeitherNullOrUndefined,
	calculateLastPosition,
	calculateLengths,
	calculateLines,
	getSeparator,
	IntuitaPosition,
	IntuitaRange,
	isNeitherNullNorUndefined,
} from '../utilities';
import { JobKind, JobOutput } from '../jobs';
import { FilePermission, Uri } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';
import { buildMoveTopLevelNodeFact } from '../features/moveTopLevelNode/2_factBuilders';
import { executeRepairCodeJob } from '../features/repairCode/executeRepairCodeJob';
import { executeMoveTopLevelNodeJob } from '../features/moveTopLevelNode/executeMoveTopLevelNodeJob';
import { MoveTopLevelNodeUserCommand } from '../features/moveTopLevelNode/1_userCommandBuilder';
import { Container } from '../container';
import { Configuration } from '../configuration';
import { buildFileUri, buildJobUri } from './intuitaFileSystem';
import {
	buildMoveTopLevelNodeJobs,
	MoveTopLevelNodeJob,
} from '../features/moveTopLevelNode/job';
import { buildRepairCodeJobs, RepairCodeJob } from '../features/repairCode/job';
import { buildRuleBasedRepairCodeJobs } from '../features/repairCode/buildRuleBasedRepairCodeJobs';

type Job = MoveTopLevelNodeJob | RepairCodeJob;

export class JobManager {
	protected _fileNames = new Map<FileNameHash, string>();
	protected _hasHadMoveTopLevelBlockJobs = new Set<FileNameHash>();
	protected _moveTopLevelBlockHashMap = new Map<FileNameHash, Set<JobHash>>();
	protected _repairCodeHashMap = new Map<FileNameHash, Set<JobHash>>();
	protected _rejectedJobHashes = new Set<JobHash>();
	protected _jobMap = new Map<JobHash, Job>();

	public constructor(
		protected readonly _messageBus: MessageBus,
		protected readonly _configurationContainer: Container<Configuration>,
	) {
		this._messageBus.subscribe(async (message) => {
			if (message.kind === MessageKind.createRepairCodeJobs) {
				setImmediate(() => this._onCreateRepairCodeJob(message));
			}

			if (message.kind === MessageKind.noExternalDiagnostics) {
				setImmediate(() => this._onNoTypeScriptDiagnostics(message));
			}

			if (
				message.kind ===
				MessageKind.ruleBasedCoreRepairDiagnosticsChanged
			) {
				setImmediate(() =>
					this.onRuleBasedCoreRepairDiagnosticsChanged(message),
				);
			}

			if (message.kind === MessageKind.externalFileUpdated) {
				setImmediate(() => this._externalFileUpdated(message));
			}
		});
	}

	public getJob(jobHash: JobHash): Job | null {
		return this._jobMap.get(jobHash) ?? null;
	}
	public getFileNameFromFileNameHash(
		fileNameHash: FileNameHash,
	): string | null {
		return this._fileNames.get(fileNameHash) ?? null;
	}

	public getFileNameFromJobHash(jobHash: JobHash): string | null {
		return this._jobMap.get(jobHash)?.fileName ?? null;
	}

	public getFileNames() {
		return Array.from(this._fileNames.values());
	}

	public getFileJobs(fileNameHash: FileNameHash): ReadonlyArray<Job> {
		const set1 =
			this._moveTopLevelBlockHashMap.get(fileNameHash) ?? new Set();
		const set2 = this._repairCodeHashMap.get(fileNameHash) ?? new Set();

		const jobHashes = [...set1, ...set2];

		return jobHashes
			.map((jobHash) => {
				if (this._rejectedJobHashes.has(jobHash)) {
					return null;
				}

				return this._jobMap.get(jobHash);
			})
			.filter(isNeitherNullNorUndefined);
	}

	public rejectJob(jobHash: JobHash) {
		const job = this.getJob(jobHash);
		assertsNeitherNullOrUndefined(job);

		const entries = Array.from(
			this._moveTopLevelBlockHashMap.entries(),
		).concat(Array.from(this._repairCodeHashMap.entries()));

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const entry = entries.find(([_, jobHashes]) => {
			return jobHashes.has(jobHash);
		});

		assertsNeitherNullOrUndefined(entry);

		const [fileNameHash, jobHashes] = entry;

		const fileName = this._fileNames.get(fileNameHash);

		assertsNeitherNullOrUndefined(fileName);

		jobHashes.delete(jobHash);

		this._rejectedJobHashes.add(jobHash);
		this._jobMap.delete(jobHash);

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			fileName,
			showTheFirstJob: false,
		});

		const uri = buildJobUri(job);

		this._messageBus.publish({
			kind: MessageKind.changePermissions,
			uri,
			permissions: FilePermission.Readonly,
		});
	}

	public acceptJob(jobHash: JobHash, characterDifference: number): void {
		const job = this._jobMap.get(jobHash);

		assertsNeitherNullOrUndefined(job);

		const fileNameHash = buildFileNameHash(job.fileName);

		const jobOutput = this.executeJob(jobHash, characterDifference);

		// clean up the state
		if (job.kind === JobKind.moveTopLevelNode) {
			const jobHashes =
				this._moveTopLevelBlockHashMap.get(fileNameHash) ?? new Set();
			jobHashes.delete(jobHash);

			this._moveTopLevelBlockHashMap.set(fileNameHash, jobHashes);
		} else if (job.kind === JobKind.repairCode) {
			const jobHashes =
				this._repairCodeHashMap.get(fileNameHash) ?? new Set();
			jobHashes.delete(jobHash);

			this._repairCodeHashMap.set(fileNameHash, jobHashes);
		}

		this._jobMap.delete(jobHash);

		// send messages
		this._messageBus.publish({
			kind: MessageKind.deleteFile,
			uri: buildJobUri(job),
		});

		this._messageBus.publish({
			kind: MessageKind.updateExternalFile,
			uri: Uri.parse(job.fileName),
			jobOutput,
		});

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			fileName: job.fileName,
			showTheFirstJob: true,
		});
	}

	public executeJob(
		jobHash: JobHash,
		characterDifference: number,
	): JobOutput {
		const job = this._jobMap.get(jobHash);

		assertsNeitherNullOrUndefined(job);

		let execution;

		if (job.kind === JobKind.moveTopLevelNode) {
			execution = executeMoveTopLevelNodeJob(job, characterDifference);
		} else if (job.kind === JobKind.repairCode) {
			execution = executeRepairCodeJob(job);
		} else {
			throw new Error('');
		}

		const lastPosition = calculateLastPosition(
			execution.text,
			job.separator,
		);

		const range: IntuitaRange = [0, 0, lastPosition[0], lastPosition[1]];

		const position: IntuitaPosition = [execution.line, execution.character];

		return {
			range,
			text: execution.text,
			position,
		};
	}

	public buildMoveTopLevelNodeJobs(uri: Uri, text: string) {
		if (uri.scheme !== 'file') {
			return;
		}

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

		const fileNameHash = buildFileNameHash(fileName);

		const oldJobHashes =
			this._moveTopLevelBlockHashMap.get(fileNameHash) ?? new Set();

		this._fileNames.set(fileNameHash, fileName);

		const newJobs = buildMoveTopLevelNodeJobs(
			userCommand,
			fact,
			this._rejectedJobHashes,
		);

		const newJobHashes = new Set(newJobs.map(({ hash }) => hash));

		oldJobHashes.forEach((jobHash) => {
			const job = this._jobMap.get(jobHash);

			if (job?.kind === JobKind.repairCode) {
				newJobHashes.add(jobHash);
			}
		});

		this._hasHadMoveTopLevelBlockJobs.add(fileNameHash);
		this._moveTopLevelBlockHashMap.set(fileNameHash, newJobHashes);

		newJobs.forEach((job) => {
			this._jobMap.set(job.hash, job);
		});

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			fileName,
			showTheFirstJob: false,
		});

		oldJobHashes.forEach((oldJobHash) => {
			if (newJobHashes.has(oldJobHash)) {
				return;
			}

			const uri = buildJobUri({
				fileName,
				hash: oldJobHash,
			});

			this._messageBus.publish({
				kind: MessageKind.deleteFile,
				uri,
			});
		});

		const fileUri = buildFileUri(uri);

		if (newJobs.length === 0) {
			this._messageBus.publish({
				kind: MessageKind.deleteFile,
				uri: fileUri,
			});
		} else {
			this._messageBus.publish({
				kind: MessageKind.writeFile,
				uri: fileUri,
				content: Buffer.from(text),
				permissions: FilePermission.Readonly,
			});
		}
	}

	public onRuleBasedCoreRepairDiagnosticsChanged(
		message: Message & {
			kind: MessageKind.ruleBasedCoreRepairDiagnosticsChanged;
		},
	) {
		const fileName = message.uri.fsPath;

		const jobs = buildRuleBasedRepairCodeJobs(
			fileName,
			message.text,
			message.version,
			message.diagnostics,
		);

		const fileUri = buildFileUri(message.uri);

		const fileNameHash = buildFileNameHash(fileName);

		const oldJobHashes = Array.from(
			this._repairCodeHashMap.get(fileNameHash) ?? new Set<JobHash>(),
		);

		const jobUris = oldJobHashes.map((hash) =>
			buildJobUri({
				fileName,
				hash,
			}),
		);

		// job clean up
		this._repairCodeHashMap.delete(fileNameHash);

		oldJobHashes.forEach((jobHash) => {
			this._jobMap.delete(jobHash);
		});

		// send messages
		jobUris.forEach((uri) => {
			this._messageBus.publish({
				kind: MessageKind.deleteFile,
				uri,
			});
		});

		this._messageBus.publish({
			kind: MessageKind.writeFile,
			uri: fileUri,
			content: Buffer.from(message.text),
			permissions: FilePermission.Readonly,
		});

		this._commitRepairCodeJobs(fileName, message.version, jobs, message.triggeredByThisUri);
	}

	protected async _onCreateRepairCodeJob(
		message: Message & { kind: MessageKind.createRepairCodeJobs },
	) {
		const fileName = message.uri.fsPath;

		const separator = getSeparator(message.text);
		const lines = calculateLines(message.text, separator);
		const lengths = calculateLengths(lines);

		const jobs = buildRepairCodeJobs(
			fileName,
			message.text,
			message.inferenceJobs,
			separator,
			lengths,
			message.version,
		);

		return this._commitRepairCodeJobs(fileName, message.version, jobs, message.triggeredByThisUri);
	}

	protected _commitRepairCodeJobs(
		fileName: string,
		version: number,
		jobs: ReadonlyArray<RepairCodeJob>,
		showTheFirstJob: boolean,
	) {
		const fileNameHash = buildFileNameHash(fileName);

		this._fileNames.set(fileNameHash, fileName);

		const newJobHashes = new Set<JobHash>();

		this._repairCodeHashMap.get(fileNameHash)?.forEach((jobHash) => {
			const job = this._jobMap.get(jobHash);

			if (job?.kind === JobKind.repairCode && job.version !== version) {
				return;
			}

			newJobHashes.add(jobHash);
		});

		jobs.forEach((job) => {
			newJobHashes.add(job.hash);

			this._jobMap.set(job.hash, job);
		});

		this._repairCodeHashMap.set(fileNameHash, newJobHashes);

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			showTheFirstJob,
			fileName,
		});
	}

	protected _onNoTypeScriptDiagnostics(
		message: Message & { kind: MessageKind.noExternalDiagnostics },
	) {
		const fileName = message.uri.fsPath;

		const fileNameHash = buildFileNameHash(fileName);

		const oldJobHashes =
			this._repairCodeHashMap.get(fileNameHash) ?? new Set<JobHash>();

		if (!oldJobHashes.size) {
			console.log(
				'No repair code jobs to delete upon receiving no TypeScript diagnostics message',
			);

			return;
		}

		const newJobHashes = new Set<JobHash>();

		oldJobHashes.forEach((jobHash) => {
			const job = this._jobMap.get(jobHash);

			if (!job) {
				return;
			}

			if (job.kind !== JobKind.repairCode) {
				newJobHashes.add(jobHash);

				this._jobMap.delete(jobHash);
			}
		});

		this._repairCodeHashMap.set(fileNameHash, newJobHashes);

		// outgoing
		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			fileName,
			showTheFirstJob: false,
		});
	}

	protected _externalFileUpdated(
		message: Message & { kind: MessageKind.externalFileUpdated },
	) {
		const fileName = message.uri.fsPath;
		const fileNameHash = buildFileNameHash(fileName);

		if (!this._hasHadMoveTopLevelBlockJobs.has(fileNameHash)) {
			return;
		}

		this.buildMoveTopLevelNodeJobs(message.uri, message.text);
	}
}
