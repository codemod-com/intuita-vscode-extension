import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { Store } from '../data';
import { actions } from '../data/slice';
import { JobHash } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { isNeitherNullNorUndefined } from '../utilities';
import { Case, CaseWithJobHashes, CaseHash } from './types';

export class CaseManager {
	public constructor(
		private readonly __messageBus: MessageBus,
		private readonly __store: Store,
	) {
		this.__messageBus.subscribe(MessageKind.upsertCases, (message) =>
			this.#onUpsertCasesMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.acceptCase, (message) =>
			this.#onAcceptCaseMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.rejectCase, (message) =>
			this.#onRejectCaseMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.jobsAccepted, (message) =>
			this.#onJobsAcceptedOrJobsRejectedMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.jobsRejected, (message) =>
			this.#onJobsAcceptedOrJobsRejectedMessage(message),
		);
		this.__messageBus.subscribe(MessageKind.clearState, () =>
			this.#onClearStateMessage(),
		);
	}

	public getCase(caseHash: CaseHash): Case | undefined {
		const state = this.__store.getState();

		return state.case.entities[caseHash];
	}

	public getJobHashes(caseHashes: Iterable<CaseHash>): ReadonlySet<JobHash> {
		const state = this.__store.getState();

		const caseHashJobHashSetManager = new LeftRightHashSetManager<
			CaseHash,
			JobHash
		>(new Set(state.caseHashJobHashes));

		const jobHashes = new Set<JobHash>();

		for (const caseHash of caseHashes) {
			const caseJobHashes =
				caseHashJobHashSetManager.getRightHashesByLeftHash(caseHash);

			for (const jobHash of caseJobHashes) {
				jobHashes.add(jobHash);
			}
		}

		return jobHashes;
	}

	public getCasesWithJobHashes(): ReadonlySet<CaseWithJobHashes> {
		const state = this.__store.getState();

		const caseHashJobHashSetManager = new LeftRightHashSetManager<
			CaseHash,
			JobHash
		>(new Set(state.caseHashJobHashes));

		const caseWithJobHashes = new Set<CaseWithJobHashes>();

		const cases = Object.values(state.case.entities).filter(
			isNeitherNullNorUndefined,
		);

		for (const kase of cases) {
			const jobHashes =
				caseHashJobHashSetManager.getRightHashesByLeftHash(kase.hash);

			caseWithJobHashes.add({
				...kase,
				jobHashes,
			});
		}

		return caseWithJobHashes;
	}

	#onUpsertCasesMessage(
		message: Message & { kind: MessageKind.upsertCases },
	) {
		const newCaseHash = message.casesWithJobHashes[0]?.hash ?? null;
		if (newCaseHash === null) {
			return;
		}

		// TODO we only upsert one case at the time I think
		message.casesWithJobHashes.map((caseWithJobHash) => {
			const caseHashJobHashes = Array.from(caseWithJobHash.jobHashes).map(
				(jobHash) => {
					return `${caseWithJobHash.hash}${jobHash}`;
				},
			);

			const kase = { ...caseWithJobHash, jobHashes: [] };

			this.__store.dispatch(actions.upsertCases([kase]));
			this.__store.dispatch(
				actions.upsertCaseHashJobHashes(caseHashJobHashes),
			);
		});

		this.__messageBus.publish({
			kind: MessageKind.upsertJobs,
			jobs: message.jobs,
		});
	}

	#onAcceptCaseMessage(message: Message & { kind: MessageKind.acceptCase }) {
		const state = this.__store.getState();

		if (!state.case.ids.includes(message.caseHash)) {
			throw new Error('You tried to accept a case that does not exist.');
		}

		const caseHashJobHashSetManager = new LeftRightHashSetManager<
			CaseHash,
			JobHash
		>(new Set(state.caseHashJobHashes));

		// we are not removing cases and jobs here
		// we wait for the jobs accepted message for data removal
		const jobHashes = caseHashJobHashSetManager.getRightHashesByLeftHash(
			message.caseHash,
		);

		this.__messageBus.publish({
			kind: MessageKind.acceptJobs,
			jobHashes,
		});
	}

	#onJobsAcceptedOrJobsRejectedMessage(
		message: Message & {
			kind: MessageKind.jobsAccepted | MessageKind.jobsRejected;
		},
	) {
		const state = this.__store.getState();

		const cases = Object.values(state.case.entities).filter(
			isNeitherNullNorUndefined,
		);

		const caseHashJobHashSetManager = new LeftRightHashSetManager<
			CaseHash,
			JobHash
		>(new Set(state.caseHashJobHashes));

		const removableCaseHashes: CaseHash[] = [];

		for (const kase of cases) {
			const caseJobHashes =
				caseHashJobHashSetManager.getRightHashesByLeftHash(kase.hash);

			let deletedCount = 0;

			for (const job of message.deletedJobs) {
				const deleted = caseHashJobHashSetManager.delete(
					kase.hash,
					job.hash,
				);

				deletedCount += Number(deleted);
			}

			if (caseJobHashes.size <= deletedCount) {
				removableCaseHashes.push(kase.hash);
			}
		}

		this.__store.dispatch(actions.removeCases(removableCaseHashes));
	}

	#onRejectCaseMessage(message: Message & { kind: MessageKind.rejectCase }) {
		const state = this.__store.getState();

		const caseHashJobHashSetManager = new LeftRightHashSetManager<
			CaseHash,
			JobHash
		>(new Set(state.caseHashJobHashes));

		const jobHashes = caseHashJobHashSetManager.getRightHashesByLeftHash(
			message.caseHash,
		);

		this.__store.dispatch(actions.removeCases([message.caseHash]));

		this.__messageBus.publish({
			kind: MessageKind.rejectJobs,
			jobHashes,
		});
	}

	#onClearStateMessage() {
		this.__store.dispatch(actions.setCases([]));
		this.__store.dispatch(actions.deleteCaseHashJobHashes());
	}
}
