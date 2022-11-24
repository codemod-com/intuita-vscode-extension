import {
	assertsNeitherNullOrUndefined,
	calculateLastPosition,
	getSeparator,
	IntuitaPosition,
	IntuitaRange,
	isNeitherNullNorUndefined,
} from '../utilities';
import { FilePermission, FileSystem, Uri } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';
import { executeRepairCodeJob } from '../features/repairCode/executeRepairCodeJob';
import { executeMoveTopLevelNodeJob } from '../features/moveTopLevelNode/executeMoveTopLevelNodeJob';

import {
	buildFileUri,
	buildJobUri,
	IntuitaFileSystem,
} from './intuitaFileSystem';
import { Job, JobHash, JobKind, JobOutput, RepairCodeJob } from '../jobs/types';
import { UriHash } from '../uris/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildUriHash } from '../uris/buildUriHash';
import { VSCodeService } from './vscodeService';
import { applyReplacementEnvelopes } from '../jobs/applyReplacementEnvelopes';
import { ReplacementEnvelope } from './inferenceService';
import { DiagnosticHash } from '../diagnostics/types';

export class JobManager {
	readonly #messageBus: MessageBus;
	readonly #intuitaFileSystem: IntuitaFileSystem;
	readonly #vscodeService: VSCodeService;
	readonly #fileSystem: FileSystem;

	#diagnosticHashJobHashSetManager = new LeftRightHashSetManager<
		DiagnosticHash,
		JobHash
	>(new Set());
	#uriHashJobHashSetManager = new LeftRightHashSetManager<UriHash, JobHash>(
		new Set(),
	);
	#rejectedJobHashes = new Set<JobHash>();
	#jobMap = new Map<JobHash, Job>();

	public constructor(
		messageBus: MessageBus,
		intuitaFileSystem: IntuitaFileSystem,
		vscodeService: VSCodeService,
		fileSystem: FileSystem,
	) {
		this.#messageBus = messageBus;
		this.#intuitaFileSystem = intuitaFileSystem;
		this.#vscodeService = vscodeService;
		this.#fileSystem = fileSystem;

		this.#messageBus.subscribe(async (message) => {
			if (message.kind === MessageKind.upsertJobs) {
				setImmediate(() => this.#onUpsertJobsMessage(message));
			}

			if (message.kind === MessageKind.acceptJobs) {
				setImmediate(() => this.#onAcceptJobsMessage(message));
			}

			if (message.kind === MessageKind.rejectJobs) {
				setImmediate(() => this.#onRejectJobsMessage(message));
			}
		});
	}

	public getJob(jobHash: JobHash): Job | null {
		return this.#jobMap.get(jobHash) ?? null;
	}

	public getFileJobs(uriHash: UriHash): ReadonlySet<Job> {
		const jobs = new Set<Job>();

		const jobHashes =
			this.#uriHashJobHashSetManager.getRightHashesByLeftHash(uriHash);

		for (const jobHash of jobHashes) {
			if (this.#rejectedJobHashes.has(jobHash)) {
				continue;
			}

			const job = this.#jobMap.get(jobHash);

			if (job) {
				jobs.add(job);
			}
		}

		return jobs;
	}

	public async buildJobOutput(
		job: Job,
		characterDifference: number,
	): Promise<JobOutput> {
		const content =
			job.kind === JobKind.rewriteFile
				? await this.#fileSystem.readFile(buildJobUri(job))
				: this.#intuitaFileSystem.readNullableFile(buildJobUri(job));

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
		const job = this.#jobMap.get(jobHash);

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

	#onUpsertJobsMessage(message: Message & { kind: MessageKind.upsertJobs }) {
		message.inactiveDiagnosticHashes.forEach((diagnosticHash) => {
			const jobHashes =
				this.#diagnosticHashJobHashSetManager.getRightHashesByLeftHash(
					diagnosticHash,
				);

			for (const jobHash of jobHashes) {
				this.#diagnosticHashJobHashSetManager.delete(
					diagnosticHash,
					jobHash,
				);

				this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
				this.#jobMap.delete(jobHash);
			}
		});

		message.inactiveJobHashes.forEach((jobHash) => {
			this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
			this.#jobMap.delete(jobHash);
		});

		for (const job of message.jobs) {
			if (this.#rejectedJobHashes.has(job.hash)) {
				continue;
			}

			this.#jobMap.set(job.hash, job);

			const uri = Uri.parse(job.fileName);
			const uriHash = buildUriHash(uri);

			this.#uriHashJobHashSetManager.upsert(uriHash, job.hash);

			if (job.diagnosticHash) {
				this.#diagnosticHashJobHashSetManager.upsert(
					job.diagnosticHash,
					job.hash,
				);
			}
		}

		this.#messageBus.publish({
			kind: MessageKind.updateElements,
			trigger: message.trigger,
		});
	}

	*#getUriHashesWithJobHashes(jobHashes: ReadonlySet<JobHash>) {
		const manager = this.#uriHashJobHashSetManager.buildByRightHashes(
			new Set(jobHashes),
		);

		const uriHashes = manager.getLeftHashes();

		for (const uriHash of uriHashes) {
			const jobHashes = manager.getRightHashesByLeftHash(uriHash);

			yield {
				uriHash,
				jobHashes,
			};
		}
	}

	async #onAcceptJobsMessage(
		message: Message & { kind: MessageKind.acceptJobs },
	) {
		const messageJobHashes =
			'jobHashes' in message ? message.jobHashes : [message.jobHash];
		const characterDifference =
			'characterDifference' in message ? message.characterDifference : 0;

		const uriJobOutputs: [Uri, JobOutput][] = [];
		const deletedJobUris: Uri[] = [];
		const deletedFileUris = new Set<Uri>();
		const deletedJobHashes = new Set<JobHash>();
		const deletedDiagnosticHashes = new Set<DiagnosticHash>();

		for (const { uriHash, jobHashes } of this.#getUriHashesWithJobHashes(
			new Set(messageJobHashes),
		)) {
			const jobs = Array.from(jobHashes)
				.map((jobHash) => this.#jobMap.get(jobHash))
				.filter(isNeitherNullNorUndefined);

			let jobOutput: JobOutput | null = null;

			if (
				jobs.length === 1 &&
				jobs[0] &&
				(jobs[0].kind === JobKind.moveTopLevelNode ||
					jobs[0].kind === JobKind.rewriteFile)
			) {
				jobOutput = await this.buildJobOutput(
					jobs[0],
					characterDifference,
				);
			} else {
				const repairCodeJobs = jobs.filter<RepairCodeJob>(
					(job): job is RepairCodeJob =>
						job.kind === JobKind.repairCode,
				);

				jobOutput = await this.#buildRepairCodeJobsOutput(
					new Set(repairCodeJobs),
					characterDifference,
				);
			}

			if (!jobOutput) {
				continue;
			}

			if (jobs[0]) {
				const uri = Uri.parse(jobs[0].fileName); // TODO job should have an URI

				uriJobOutputs.push([uri, jobOutput]);
				deletedFileUris.add(buildFileUri(uri));
			}

			const otherJobHashes =
				this.#uriHashJobHashSetManager.getRightHashesByLeftHash(
					uriHash,
				);

			for (const jobHash of otherJobHashes) {
				const job = this.#jobMap.get(jobHash);

				if (job) {
					deletedJobUris.push(buildJobUri(job));

					if (job.kind === JobKind.repairCode && job.diagnosticHash) {
						deletedDiagnosticHashes.add(job.diagnosticHash);
					}
				}

				this.#uriHashJobHashSetManager.delete(uriHash, jobHash);
				this.#diagnosticHashJobHashSetManager.deleteRightHash(jobHash);
				this.#jobMap.delete(jobHash);

				deletedJobHashes.add(jobHash);
			}
		}

		deletedJobUris.forEach((jobUri) => {
			this.#messageBus.publish({
				kind: MessageKind.deleteFile,
				uri: jobUri,
			});
		});

		deletedFileUris.forEach((fileUri) => {
			this.#messageBus.publish({
				kind: MessageKind.deleteFile,
				uri: fileUri,
			});
		});

		uriJobOutputs.forEach(([uri, jobOutput]) => {
			this.#messageBus.publish({
				kind: MessageKind.updateExternalFile,
				uri,
				jobOutput,
			});
		});

		this.#messageBus.publish({
			kind: MessageKind.jobsAccepted,
			deletedJobHashes,
			deletedDiagnosticHashes,
		});
	}

	async #buildRepairCodeJobsOutput(
		jobs: Set<RepairCodeJob>,
		characterDifference: number,
	): Promise<JobOutput | null> {
		const sortedJobs = Array.from(jobs).sort(
			(a, b) => a.simpleRange.start - b.simpleRange.start,
		);

		const firstJob = sortedJobs[0];

		if (!firstJob) {
			return null;
		}

		const uri = Uri.parse(firstJob.fileName); // TODO jobs should have URI

		const document = await this.#vscodeService.openTextDocument(uri);

		const documentText = document.getText();

		const replacementEnvelopes: ReplacementEnvelope[] = [];

		for (const job of sortedJobs) {
			const jobOutput = await this.buildJobOutput(
				job,
				characterDifference,
			);

			const start = job.simpleRange.start;
			const end =
				job.simpleRange.end +
				(jobOutput.text.length - documentText.length);

			const replacement = jobOutput.text.slice(start, end);

			replacementEnvelopes.push({ range: job.simpleRange, replacement });
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

	#onRejectJobsMessage(message: Message & { kind: MessageKind.rejectJobs }) {
		const uris: Uri[] = [];

		for (const jobHash of message.jobHashes) {
			const job = this.getJob(jobHash);
			assertsNeitherNullOrUndefined(job);

			uris.push(buildJobUri(job));

			this.#rejectedJobHashes.add(jobHash);
			this.#diagnosticHashJobHashSetManager.deleteRightHash(jobHash);
			this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
			this.#jobMap.delete(jobHash);
		}

		this.#messageBus.publish({
			kind: MessageKind.updateElements,
			trigger: 'onCommand',
		});

		for (const uri of uris) {
			this.#messageBus.publish({
				kind: MessageKind.changePermissions,
				uri,
				permissions: FilePermission.Readonly,
			});
		}
	}
}
