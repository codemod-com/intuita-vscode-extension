import {
	assertsNeitherNullOrUndefined,
	isNeitherNullNorUndefined,
} from '../utilities';
import { Uri } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';
import { Job, JobHash } from '../jobs/types';
import { UriHash } from '../uris/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildUriHash } from '../uris/buildUriHash';

export class JobManager {
	readonly #messageBus: MessageBus;

	#uriHashJobHashSetManager = new LeftRightHashSetManager<UriHash, JobHash>(
		new Set(),
	);
	#rejectedJobHashes = new Set<JobHash>();
	#jobMap = new Map<JobHash, Job>();

	public constructor(messageBus: MessageBus) {
		this.#messageBus = messageBus;

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

	#onUpsertJobsMessage(message: Message & { kind: MessageKind.upsertJobs }) {
		message.inactiveJobHashes.forEach((jobHash) => {
			this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
			this.#jobMap.delete(jobHash);
		});

		for (const job of message.jobs) {
			if (this.#rejectedJobHashes.has(job.hash)) {
				continue;
			}

			this.#jobMap.set(job.hash, job);

			const uri = job.inputUri;
			const uriHash = buildUriHash(uri);

			this.#uriHashJobHashSetManager.upsert(uriHash, job.hash);
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

		const uriJobOutputs: [Uri, Uri][] = [];
		const deletedJobHashes = new Set<JobHash>();

		for (const { uriHash, jobHashes } of this.#getUriHashesWithJobHashes(
			new Set(messageJobHashes),
		)) {
			const jobs = Array.from(jobHashes)
				.map((jobHash) => this.#jobMap.get(jobHash))
				.filter(isNeitherNullNorUndefined);

			if (jobs[0]) {
				const uri = jobs[0].inputUri;

				uriJobOutputs.push([uri, jobs[0].outputUri]);
			}

			const otherJobHashes =
				this.#uriHashJobHashSetManager.getRightHashesByLeftHash(
					uriHash,
				);

			for (const jobHash of otherJobHashes) {
				this.#uriHashJobHashSetManager.delete(uriHash, jobHash);
				this.#jobMap.delete(jobHash);
			}
		}

		uriJobOutputs.forEach(([uri, jobOutputUri]) => {
			this.#messageBus.publish({
				kind: MessageKind.updateExternalFile,
				uri,
				contentUri: jobOutputUri,
			});
		});

		this.#messageBus.publish({
			kind: MessageKind.jobsAccepted,
			deletedJobHashes,
		});
	}

	#onRejectJobsMessage(message: Message & { kind: MessageKind.rejectJobs }) {
		for (const jobHash of message.jobHashes) {
			const job = this.getJob(jobHash);
			assertsNeitherNullOrUndefined(job);

			this.#rejectedJobHashes.add(jobHash);
			this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
			this.#jobMap.delete(jobHash);
		}

		this.#messageBus.publish({
			kind: MessageKind.updateElements,
			trigger: 'onCommand',
		});
	}
}
