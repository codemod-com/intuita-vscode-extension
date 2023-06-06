import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { JobHash } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { Case, CaseWithJobHashes, CaseHash } from './types';

export class CaseManager {
	readonly #messageBus: MessageBus;
	readonly #cases: Map<CaseHash, Case>;
	readonly #caseHashJobHashSetManager: LeftRightHashSetManager<
		CaseHash,
		JobHash
	>;

	public constructor(
		cases: ReadonlyArray<Case>,
		caseHashJobHashes: ReadonlySet<string>,
		messageBus: MessageBus,
	) {
		this.#messageBus = messageBus;
		this.#cases = new Map(cases.map((kase) => [kase.hash, kase]));
		this.#caseHashJobHashSetManager = new LeftRightHashSetManager(
			caseHashJobHashes,
		);

		this.#messageBus.subscribe(MessageKind.upsertCases, (message) =>
			this.#onUpsertCasesMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.acceptCase, (message) =>
			this.#onAcceptCaseMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.rejectCase, (message) =>
			this.#onRejectCaseMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.jobsAccepted, (message) =>
			this.#onJobsAcceptedOrJobsRejectedMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.jobsRejected, (message) =>
			this.#onJobsAcceptedOrJobsRejectedMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.clearState, () =>
			this.#onClearStateMessage(),
		);
	}

	public getCases(): IterableIterator<Case> {
		return this.#cases.values();
	}

	public getCase(caseHash: CaseHash): Case | undefined {
		return this.#cases.get(caseHash);
	}

	public getCaseCount(): number {
		return this.#cases.size;
	}

	public getCaseHashJobHashSetValues(): IterableIterator<string> {
		return this.#caseHashJobHashSetManager.getSetValues();
	}

	public getJobHashes(caseHashes: Iterable<CaseHash>): ReadonlySet<JobHash> {
		const jobHashes = new Set<JobHash>();

		for (const caseHash of caseHashes) {
			const caseJobHashes =
				this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
					caseHash,
				);

			for (const jobHash of caseJobHashes) {
				jobHashes.add(jobHash);
			}
		}

		return jobHashes;
	}

	public getCasesWithJobHashes(): ReadonlySet<CaseWithJobHashes> {
		const caseWithJobHashes = new Set<CaseWithJobHashes>();

		for (const kase of this.#cases.values()) {
			const jobHashes =
				this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
					kase.hash,
				);

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

		message.casesWithJobHashes.map((caseWithJobHash) => {
			this.#cases.set(caseWithJobHash.hash, caseWithJobHash);

			for (const jobHash of caseWithJobHash.jobHashes) {
				this.#caseHashJobHashSetManager.upsert(
					caseWithJobHash.hash,
					jobHash,
				);
			}
		});

		this.#messageBus.publish({
			kind: MessageKind.upsertJobs,
			jobs: message.jobs,
			inactiveJobHashes: message.inactiveJobHashes,
		});
	}

	#onAcceptCaseMessage(message: Message & { kind: MessageKind.acceptCase }) {
		if (!this.#cases.has(message.caseHash)) {
			throw new Error('You tried to accept a case that does not exist.');
		}

		// we are not removing cases and jobs here
		// we wait for the jobs accepted message for data removal
		const jobHashes =
			this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
				message.caseHash,
			);

		this.#messageBus.publish({
			kind: MessageKind.acceptJobs,
			jobHashes,
		});
	}

	#onJobsAcceptedOrJobsRejectedMessage(
		message: Message & {
			kind: MessageKind.jobsAccepted | MessageKind.jobsRejected;
		},
	) {
		for (const kase of this.#cases.values()) {
			const caseJobHashes =
				this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
					kase.hash,
				);

			let deletedCount = 0;

			for (const job of message.deletedJobs) {
				const deleted = this.#caseHashJobHashSetManager.delete(
					kase.hash,
					job.hash,
				);

				deletedCount += Number(deleted);
			}

			if (caseJobHashes.size <= deletedCount) {
				this.#cases.delete(kase.hash);
			}
		}

		this.#messageBus.publish({
			kind: MessageKind.updateElements,
		});
	}

	#onRejectCaseMessage(message: Message & { kind: MessageKind.rejectCase }) {
		const deleted = this.#cases.delete(message.caseHash);

		if (!deleted) {
			throw new Error('You tried to remove a case that does not exist.');
		}

		const jobHashes =
			this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
				message.caseHash,
			);

		this.#messageBus.publish({
			kind: MessageKind.rejectJobs,
			jobHashes,
		});
	}

	#onClearStateMessage() {
		this.#cases.clear();
		this.#caseHashJobHashSetManager.clear();
	}
}
