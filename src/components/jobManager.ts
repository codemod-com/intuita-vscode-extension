import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { Uri } from 'vscode';
import { Message, MessageBus, MessageKind } from './messageBus';
import { Job, JobHash, JobKind } from '../jobs/types';
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
	#acceptedJobsHashes: Set<JobHash>;

	#uriHashJobHashSetManager: LeftRightHashSetManager<string, JobHash>;

	public constructor(
		jobs: ReadonlyArray<Job>,
		acceptedJobsHashes: ReadonlyArray<JobHash>,
		messageBus: MessageBus,
	) {
		this.#jobMap = new Map(jobs.map((job) => [job.hash, job]));
		this.#acceptedJobsHashes = new Set(acceptedJobsHashes);

		this.#uriHashJobHashSetManager = new LeftRightHashSetManager(
			new Set(
				jobs.flatMap((job) => {
					const hashes: string[] = [];

					if (job.oldUri) {
						hashes.push(`${buildUriHash(job.oldUri)}${job.hash}`);
					}

					if (job.newUri) {
						hashes.push(`${buildUriHash(job.newUri)}${job.hash}`);
					}

					return hashes;
				}),
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

	public getJob(jobHash: JobHash): Job | null {
		return this.#jobMap.get(jobHash) ?? null;
	}

	public getFileJobs(uriHash: string): ReadonlySet<Job> {
		const jobs = new Set<Job>();

		const jobHashes =
			this.#uriHashJobHashSetManager.getRightHashesByLeftHash(uriHash);

		for (const jobHash of jobHashes) {
			const job = this.#jobMap.get(jobHash);

			if (job) {
				jobs.add(job);
			}
		}

		return jobs;
	}

	public getAcceptedJobsHashes() {
		return this.#acceptedJobsHashes;
	}

	public isJobAccepted(jobHash: JobHash) {
		return this.#acceptedJobsHashes.has(jobHash);
	}

	#onUpsertJobsMessage(message: Message & { kind: MessageKind.upsertJobs }) {
		message.inactiveJobHashes.forEach((jobHash) => {
			this.#uriHashJobHashSetManager.deleteRightHash(jobHash);
			this.#jobMap.delete(jobHash);
		});

		for (const job of message.jobs) {
			this.#jobMap.set(job.hash, job);

			if (job.oldUri) {
				const uriHash = buildUriHash(job.oldUri);

				this.#uriHashJobHashSetManager.upsert(uriHash, job.hash);
			}

			if (job.newUri) {
				const uriHash = buildUriHash(job.newUri);

				this.#uriHashJobHashSetManager.upsert(uriHash, job.hash);
			}
		}

		this.#messageBus.publish({
			kind: MessageKind.updateElements,
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
		// HERE

		const { codemodHashJobHashSetManager, codemods } =
			this.#buildCodemodObjects(message.jobHashes);

		const messages: Message[] = [];

		for (const jobHash of message.jobHashes) {
			this.#acceptedJobsHashes.add(jobHash);
		}

		messages.push({ kind: MessageKind.updateElements });

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
			const createJobOutputs: [Uri, Uri, boolean][] = [];
			const updateJobOutputs: [Uri, Uri][] = [];
			const deleteJobOutputs: Uri[] = [];
			const moveJobOutputs: [Uri, Uri, Uri][] = [];

			for (const {
				// uriHash,
				jobHashes,
			} of this.#getUriHashesWithJobHashes(message.jobHashes)) {
				const jobs = Array.from(jobHashes)
					.map((jobHash) => this.#jobMap.get(jobHash))
					.filter(isNeitherNullNorUndefined);

				const job = jobs[0];

				if (
					job &&
					job.kind === JobKind.createFile &&
					job.newUri &&
					job.newContentUri
				) {
					createJobOutputs.push([
						job.newUri,
						job.newContentUri,
						true,
					]);
				}

				if (job && job.kind === JobKind.deleteFile && job.oldUri) {
					deleteJobOutputs.push(job.oldUri);
				}

				if (
					job &&
					(job.kind === JobKind.moveAndRewriteFile ||
						job.kind === JobKind.moveFile) &&
					job.oldUri &&
					job.newUri &&
					job.newContentUri
				) {
					moveJobOutputs.push([
						job.oldUri,
						job.newUri,
						job.newContentUri,
					]);
				}

				if (
					job &&
					job.kind === JobKind.rewriteFile &&
					job.oldUri &&
					job.newContentUri
				) {
					updateJobOutputs.push([job.oldUri, job.newContentUri]);
				}

				if (
					job &&
					job.kind === JobKind.copyFile &&
					job.newUri &&
					job.newContentUri
				) {
					createJobOutputs.push([
						job.newUri,
						job.newContentUri,
						false,
					]);
				}
				// We should not delete the job after "apply". User may want to create PR for this job
				// const otherJobHashes =
				// 	this.#uriHashJobHashSetManager.getRightHashesByLeftHash(
				// 		uriHash,
				// 	);

				// for (const jobHash of otherJobHashes) {
				// 	this.#uriHashJobHashSetManager.delete(uriHash, jobHash);
				// 	this.#jobMap.delete(jobHash);
				// }
			}

			// TODO here

			createJobOutputs.forEach(
				([newUri, newContentUri, deleteNewContentUri]) => {
					messages.push({
						kind: MessageKind.createFile,
						newUri,
						newContentUri,
						deleteNewContentUri,
					});
				},
			);

			updateJobOutputs.forEach(([uri, jobOutputUri]) => {
				messages.push({
					kind: MessageKind.updateFile,
					uri,
					contentUri: jobOutputUri,
				});
			});

			moveJobOutputs.forEach(([oldUri, newUri, newContentUri]) => {
				messages.push({
					kind: MessageKind.moveFile,
					oldUri,
					newUri,
					newContentUri,
				});
			});

			if (deleteJobOutputs.length !== 0) {
				messages.push({
					kind: MessageKind.deleteFiles,
					uris: deleteJobOutputs.slice(),
				});
			}
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

			if (
				job &&
				(job.kind === JobKind.rewriteFile ||
					job.kind === JobKind.moveAndRewriteFile) &&
				job.newContentUri
			) {
				messages.push({
					kind: MessageKind.deleteFiles,
					uris: [job.newContentUri],
				});
			}

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
		const uris: Uri[] = [];

		for (const job of this.#jobMap.values()) {
			if (
				(job.kind === JobKind.rewriteFile ||
					job.kind === JobKind.moveAndRewriteFile) &&
				job.newContentUri
			) {
				uris.push(job.newContentUri);
			}
		}

		this.#jobMap.clear();
		this.#uriHashJobHashSetManager.clear();
		this.#acceptedJobsHashes.clear();

		this.#messageBus.publish({
			kind: MessageKind.deleteFiles,
			uris,
		});
	}
}
