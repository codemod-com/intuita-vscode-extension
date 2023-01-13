import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { Uri } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';
import { Job, JobHash } from '../jobs/types';
import { UriHash } from '../uris/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { buildUriHash } from '../uris/buildUriHash';

type Codemod = Readonly<{
	setName: string;
	name: string;
}>;

type CodemodHash = string & { __CodemodHash: '__CodemodHash' };

const buildCodemodHash = ({ setName, name }: Codemod) =>
	buildHash([setName, name].join(',')) as CodemodHash;

export class JobManager {
	readonly #messageBus: MessageBus;

	#jobMap: Map<JobHash, Job>;
	#rejectedJobHashes: Set<JobHash>;
	#uriHashJobHashSetManager: LeftRightHashSetManager<UriHash, JobHash>;

	public constructor(
		jobs: ReadonlyArray<Job>,
		rejectedJobHashes: Set<JobHash>,
		messageBus: MessageBus,
	) {
		this.#jobMap = new Map(jobs.map((job) => [job.hash, job]));
		this.#rejectedJobHashes = rejectedJobHashes;
		this.#uriHashJobHashSetManager = new LeftRightHashSetManager(
			new Set(
				jobs.map((job) => `${buildUriHash(job.inputUri)}${job.hash}`),
			),
		);

		this.#messageBus = messageBus;

		this.#messageBus.subscribe(MessageKind.upsertJobs, (message) =>
			this.#onUpsertJobsMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.acceptJobs, (message) =>
			this.#onAcceptJobsMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.rejectJobs, (message) =>
			this.#onRejectJobsMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.clearState, () =>
			this.#onClearStateMessage(),
		);
	}

	public getJobs(): IterableIterator<Job> {
		return this.#jobMap.values();
	}

	public getRejectedJobHashes(): IterableIterator<JobHash> {
		return this.#rejectedJobHashes.values();
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
		const { codemodHashJobHashSetManager, codemods } =
			this.#buildCodemodObjects(message.jobHashes);

		const messages: Message[] = [];

		{
			const codemodHashes = codemodHashJobHashSetManager.getLeftHashes();

			for (const codemodHash of codemodHashes) {
				const deletedJobHashes =
					codemodHashJobHashSetManager.getRightHashesByLeftHash(
						codemodHash,
					);
				const codemod = codemods.get(codemodHash);

				if (!deletedJobHashes || !codemod) {
					continue;
				}

				messages.push({
					kind: MessageKind.jobsAccepted,
					deletedJobHashes,
					codemodSetName: codemod.setName,
					codemodName: codemod.name,
				});
			}
		}

		{
			const uriJobOutputs: [Uri, Uri][] = [];

			for (const {
				uriHash,
				jobHashes,
			} of this.#getUriHashesWithJobHashes(message.jobHashes)) {
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
				messages.push({
					kind: MessageKind.updateFile,
					uri,
					contentUri: jobOutputUri,
				});
			});
		}

		for (const message of messages) {
			this.#messageBus.publish(message);
		}
	}

	#onRejectJobsMessage(message: Message & { kind: MessageKind.rejectJobs }) {
		const { codemodHashJobHashSetManager, codemods } =
			this.#buildCodemodObjects(message.jobHashes);

		const messages: Message[] = [];

		{
			const codemodHashes = codemodHashJobHashSetManager.getLeftHashes();

			for (const codemodHash of codemodHashes) {
				const deletedJobHashes =
					codemodHashJobHashSetManager.getRightHashesByLeftHash(
						codemodHash,
					);
				const codemod = codemods.get(codemodHash);

				if (!deletedJobHashes || !codemod) {
					continue;
				}

				messages.push({
					kind: MessageKind.jobsRejected,
					deletedJobHashes,
					codemodSetName: codemod.setName,
					codemodName: codemod.name,
				});
			}
		}

		for (const jobHash of message.jobHashes) {
			const job = this.#jobMap.get(jobHash);

			if (job) {
				messages.push({
					kind: MessageKind.deleteFile,
					uri: job.outputUri,
				});
			}

			this.#rejectedJobHashes.add(jobHash);
			this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
			this.#jobMap.delete(jobHash);
		}

		for (const message of messages) {
			this.#messageBus.publish(message);
		}
	}

	#buildCodemodObjects(jobHashes: ReadonlySet<JobHash>) {
		const codemodHashJobHashSetManager = new LeftRightHashSetManager<
			CodemodHash,
			JobHash
		>(new Set());
		const codemods = new Map<CodemodHash, Codemod>();

		for (const jobHash of jobHashes) {
			const job = this.#jobMap.get(jobHash);

			if (!job) {
				continue;
			}

			const codemod: Codemod = {
				setName: job.codemodSetName,
				name: job.codemodName,
			};

			const codemodHash = buildCodemodHash(codemod);

			codemodHashJobHashSetManager.upsert(codemodHash, jobHash);
			codemods.set(codemodHash, codemod);
		}

		return {
			codemodHashJobHashSetManager,
			codemods,
		};
	}

	#onClearStateMessage() {
		const messages: Message[] = [];

		for (const job of this.#jobMap.values()) {
			messages.push({
				kind: MessageKind.deleteFile,
				uri: job.outputUri,
			});
		}

		this.#jobMap.clear();
		this.#rejectedJobHashes.clear();
		this.#uriHashJobHashSetManager.clear();
	}
}
