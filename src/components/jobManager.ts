import { isNeitherNullNorUndefined } from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';
import {
	JobHash,
	JobKind,
	mapJobToPersistedJob,
	mapPersistedJobToJob,
} from '../jobs/types';
import { FileService } from './fileService';
import { acceptJobs } from '../jobs/acceptJobs';
import { Store } from '../data';
import { actions } from '../data/slice';

export class JobManager {
	public constructor(
		private readonly __fileService: FileService,
		private readonly __messageBus: MessageBus,
		private readonly __store: Store,
	) {
		this.__messageBus.subscribe(MessageKind.upsertJobs, (message) =>
			this.__onUpsertJobsMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.acceptJobs, (message) =>
			this.__onAcceptJobsMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.rejectJobs, (message) =>
			this.__onRejectJobsMessage(message),
		);
	}

	private __onUpsertJobsMessage(
		message: Message & { kind: MessageKind.upsertJobs },
	) {
		const persistedJobs = message.jobs.map(mapJobToPersistedJob);

		this.__store.dispatch(actions.upsertJobs(persistedJobs));
	}

	private async __onAcceptJobsMessage(
		message: Message & { kind: MessageKind.acceptJobs },
	) {
		this.acceptJobs(message.jobHashes);
	}

	public async acceptJobs(jobHashes: ReadonlySet<JobHash>): Promise<void> {
		const state = this.__store.getState();

		const deletedJobs = Array.from(jobHashes)
			.map((jobHash) => state.job.entities[jobHash])
			.filter(isNeitherNullNorUndefined)
			.map(mapPersistedJobToJob);

		await acceptJobs(this.__fileService, deletedJobs);

		this.deleteJobs(Array.from(jobHashes));

		this.__messageBus.publish({
			kind: MessageKind.jobsAccepted,
			deletedJobs: new Set(deletedJobs),
		});
	}

	public deleteJobs(jobHash: ReadonlyArray<JobHash>) {
		this.__store.dispatch(actions.deleteJobs(jobHash));
	}

	private __onRejectJobsMessage(
		message: Message & { kind: MessageKind.rejectJobs },
	) {
		const state = this.__store.getState();

		const deletedJobs = Array.from(message.jobHashes)
			.map((jobHash) => state.job.entities[jobHash])
			.filter(isNeitherNullNorUndefined)
			.map(mapPersistedJobToJob);

		const messages: Message[] = [];

		messages.push({
			kind: MessageKind.jobsRejected,
			deletedJobs: new Set(deletedJobs),
		});

		for (const job of deletedJobs) {
			if (
				(job.kind === JobKind.rewriteFile ||
					job.kind === JobKind.moveAndRewriteFile ||
					job.kind === JobKind.createFile ||
					job.kind === JobKind.moveFile) &&
				job.newContentUri
			) {
				messages.push({
					kind: MessageKind.deleteFiles,
					uris: [job.newContentUri],
				});
			}
		}

		this.deleteJobs(deletedJobs.map(({ hash }) => hash));

		for (const message of messages) {
			this.__messageBus.publish(message);
		}
	}

	public async modifyJobContent(jobHash: JobHash, newJobContent: string) {
		const job = { newContentUri: null };
		const newContentUri = job?.newContentUri ?? null;

		if (newContentUri === null) {
			return;
		}

		await this.__fileService.updateFileContent({
			uri: newContentUri,
			content: newJobContent,
		});
		// this.#jobMap.set(jobHash, { ...job, modifiedByUser: true } as Job);
	}
}
