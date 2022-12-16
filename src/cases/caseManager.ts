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

		this.#messageBus.subscribe((message) => {
			if (message.kind === MessageKind.upsertCases) {
				setImmediate(() => {
					this.#onUpsertCasesMessage(message);
				});
			}

			if (message.kind === MessageKind.acceptCase) {
				setImmediate(() => {
					this.#onAcceptCaseMessage(message);
				});
			}

			if (message.kind === MessageKind.jobsAccepted) {
				setImmediate(() => {
					this.#onJobAcceptedMessage(message);
				});
			}

			if (message.kind === MessageKind.rejectCase) {
				setImmediate(() => {
					this.#onRejectCaseMessage(message);
				});
			}

			if (message.kind === MessageKind.clearState) {
				setImmediate(() => {
					this.#onClearStateMessage();
				});
			}
		});
	}

	public getCases(): IterableIterator<Case> {
		return this.#cases.values();
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
			trigger: message.trigger,
		});
	}

	#onAcceptCaseMessage(message: Message & { kind: MessageKind.acceptCase }) {
		// we are not removing cases and jobs here
		// we wait for the jobs accepted message for data removal
		const jobHashes =
			this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
				message.caseHash,
			);

		this.#messageBus.publish({
			kind: MessageKind.acceptJobs,
			caseHash: message.caseHash,
			jobHashes,
		});
	}

	#onJobAcceptedMessage(
		message: Message & { kind: MessageKind.jobsAccepted },
	) {
		for (const jobHash of message.deletedJobHashes) {
			this.#caseHashJobHashSetManager.deleteRightHash(jobHash);
		}

		for (const kase of this.#cases.values()) {
			const jobHashes =
				this.#caseHashJobHashSetManager.getRightHashesByLeftHash(
					kase.hash,
				);

			if (jobHashes.size === 0) {
				this.#cases.delete(kase.hash);
			}
		}

		this.#messageBus.publish({
			kind: MessageKind.updateElements,
			trigger: 'onCommand',
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

		for (const jobHash of jobHashes) {
			this.#caseHashJobHashSetManager.delete(message.caseHash, jobHash);
		}

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
