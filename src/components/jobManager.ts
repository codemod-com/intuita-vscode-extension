import {
	assertsNeitherNullOrUndefined,
	calculateLastPosition,
	getSeparator,
	IntuitaPosition,
	IntuitaRange,
	isNeitherNullNorUndefined,
} from '../utilities';
import { FilePermission, Uri } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';
import { executeRepairCodeJob } from '../features/repairCode/executeRepairCodeJob';
import { executeMoveTopLevelNodeJob } from '../features/moveTopLevelNode/executeMoveTopLevelNodeJob';
import { Container } from '../container';
import { Configuration } from '../configuration';
import { buildJobUri, IntuitaFileSystem } from './intuitaFileSystem';
import { Job, JobHash, JobKind, JobOutput, RepairCodeJob } from '../jobs/types';
import { UriHash } from '../uris/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildUriHash } from '../uris/buildUriHash';
import { VSCodeService } from './vscodeService';
import { applyReplacementEnvelopes } from '../jobs/applyReplacementEnvelopes';
import { ReplacementEnvelope } from './inferenceService';

export class JobManager {
	protected _uriHashJobHashSetManager = new LeftRightHashSetManager<
		UriHash,
		JobHash
	>(new Set());
	protected _rejectedJobHashes = new Set<JobHash>();
	protected _jobMap = new Map<JobHash, Job>();

	public constructor(
		protected readonly _messageBus: MessageBus,
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _intuitaFileSystem: IntuitaFileSystem,
		protected readonly _vscodeService: VSCodeService,
	) {
		this._messageBus.subscribe(async (message) => {
			if (message.kind === MessageKind.upsertJobs) {
				setImmediate(() => this._onUpsertJobsMessage(message));
			}

			if (message.kind === MessageKind.acceptJobs) {
				setImmediate(() => this._onAcceptJobsMessage(message));
			}

			if (message.kind === MessageKind.rejectJobs) {
				setImmediate(() => this._onRejectJobsMessage(message));
			}
		});
	}

	public getJob(jobHash: JobHash): Job | null {
		return this._jobMap.get(jobHash) ?? null;
	}

	public getFileJobs(uriHash: UriHash): ReadonlyArray<Job> {
		const jobHashes =
			this._uriHashJobHashSetManager.getRightHashesByLeftHash(uriHash);

		return jobHashes
			.map((jobHash) => {
				if (this._rejectedJobHashes.has(jobHash)) {
					return null;
				}

				return this._jobMap.get(jobHash);
			})
			.filter(isNeitherNullNorUndefined);
	}

	public buildJobOutput(job: Job, characterDifference: number): JobOutput {
		const content = this._intuitaFileSystem.readNullableFile(
			buildJobUri(job),
		);

		if (!content) {
			return this.executeJob(job.hash, characterDifference);
		}

		const text = content.toString();
		const separator = getSeparator(text);

		const position = calculateLastPosition(text, separator);

		const range: IntuitaRange = [0, 0, position[0], position[1]];

		return {
			text,
			position,
			range,
		};
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

	protected _onUpsertJobsMessage(
		message: Message & { kind: MessageKind.upsertJobs },
	) {
		message.inactiveHashes.forEach((diagnosticHash) => {
			const jobHash = diagnosticHash as unknown as JobHash;

			this._uriHashJobHashSetManager.deleteRightHash(jobHash);
			this._jobMap.delete(jobHash);
		});

		for (const job of message.jobs) {
			if (this._rejectedJobHashes.has(job.hash)) {
				continue;
			}

			this._jobMap.set(job.hash, job);

			const uri = Uri.parse(job.fileName);
			const uriHash = buildUriHash(uri);

			this._uriHashJobHashSetManager.upsert(uriHash, job.hash);
		}

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			trigger: message.trigger,
		});
	}

	protected async _onAcceptJobsMessage(
		message: Message & { kind: MessageKind.acceptJobs },
	) {
		const jobHashes =
			'jobHashes' in message ? message.jobHashes : [message.jobHash];
		const characterDifference =
			'characterDifference' in message ? message.characterDifference : 0;

		const manager = this._uriHashJobHashSetManager.buildByRightHashes(new Set(jobHashes));
		const uriHashes = manager.getLeftHashes();

		const uriJobOutputs: [Uri, JobOutput][] = [];
		const jobUris: Uri[] = [];
		const deletedJobHashes = new Set<JobHash>();
 
		for (const uriHash of uriHashes) {
			const jobHashes = manager.getRightHashesByLeftHash(uriHash);

			const jobs = jobHashes.map((jobHash) => this._jobMap.get(jobHash))
				.filter(isNeitherNullNorUndefined)
				// TODO this makes other job kinds non-workable
				.filter<RepairCodeJob>((job): job is RepairCodeJob => job.kind === JobKind.repairCode)

			const jobOutput = await this._buildRepairCodeJobsOutput(new Set(jobs), characterDifference);

			if (!jobOutput) {
				continue;
			}
	
			for (const job of jobs) {
				this._uriHashJobHashSetManager.delete(uriHash, job.hash);
				this._jobMap.delete(job.hash);
	
				jobUris.push(buildJobUri(job));
				deletedJobHashes.add(job.hash);
			}

			if (jobs[0]) {
				const uri = Uri.parse(jobs[0].fileName); // TODO job should have an URI

				uriJobOutputs.push([uri, jobOutput]);
			}

			const otherJobHashes = this._uriHashJobHashSetManager.getRightHashesByLeftHash(uriHash);

			for (const jobHash of otherJobHashes) {
				const job = this._jobMap.get(jobHash);

				if (job) {
					jobUris.push(buildJobUri(job));
				}

				this._uriHashJobHashSetManager.delete(uriHash, jobHash);
				this._jobMap.delete(jobHash);

				deletedJobHashes.add(jobHash);
			}
		}
	
		jobUris.forEach((jobUri) => {
			this._messageBus.publish({
				kind: MessageKind.deleteFile,
				uri: jobUri,
			});
		});

		uriJobOutputs.forEach(([uri, jobOutput]) => {
			this._messageBus.publish({
				kind: MessageKind.updateExternalFile,
				uri,
				jobOutput,
			});
		});

		this._messageBus.publish({
			kind: MessageKind.jobsAccepted,
			deletedJobHashes,
		});
	}

	protected async _buildRepairCodeJobsOutput(jobs: Set<RepairCodeJob>, characterDifference: number): Promise<JobOutput | null> {
		const sortedJobs = Array.from(jobs).sort((a, b) => a.simpleRange.start - b.simpleRange.start);

		const firstJob = sortedJobs[0];

		if (!firstJob) {
			return null;
		}

		const uri = Uri.parse(firstJob.fileName); // TODO jobs should have URI

		const document = await this._vscodeService.openTextDocument(uri);

		const documentText = document.getText();

		const replacementEnvelopes: ReplacementEnvelope[] = [];

		for (const job of sortedJobs) {
			const jobOutput = this.buildJobOutput(job, characterDifference);

			const start = job.simpleRange.start;
			const end = job.simpleRange.end + (jobOutput.text.length - documentText.length);

			const replacement = jobOutput.text.slice(start, end);

			replacementEnvelopes.push({range: job.simpleRange, replacement });
		}

		const text = applyReplacementEnvelopes(
			documentText,
			replacementEnvelopes,
		);

		const separator = getSeparator(text);

		const position = calculateLastPosition(text, separator);

		const range: IntuitaRange = [0, 0, position[0], position[1]];

		return {
			text,
			position,
			range,
		};
	}

	protected _onRejectJobsMessage(
		message: Message & { kind: MessageKind.rejectJobs },
	) {
		const uris: Uri[] = [];

		for (const jobHash of message.jobHashes) {
			const job = this.getJob(jobHash);
			assertsNeitherNullOrUndefined(job);

			uris.push(buildJobUri(job));

			this._rejectedJobHashes.add(jobHash);
			this._uriHashJobHashSetManager.deleteRightHash(jobHash);
			this._jobMap.delete(jobHash);
		}

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
			trigger: 'onCommand',
		});

		for (const uri of uris) {
			this._messageBus.publish({
				kind: MessageKind.changePermissions,
				uri,
				permissions: FilePermission.Readonly,
			});
		}
	}
}
