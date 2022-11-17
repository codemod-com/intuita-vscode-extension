import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { JobHash } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { Case, CaseWithJobHashes, CaseHash } from './types';

export class CaseManager {
	protected readonly _cases = new Map<CaseHash, Case>();
	protected readonly _caseHashJobHashSetManager = new LeftRightHashSetManager<
		CaseHash,
		JobHash
	>(new Set());

	public constructor(protected readonly _messageBus: MessageBus) {
		_messageBus.subscribe((message) => {
			if (message.kind === MessageKind.upsertCases) {
				setImmediate(() => {
					this._onUpsertCasesMessage(message);
				});
			}

			if (message.kind === MessageKind.acceptCase) {
				setImmediate(() => {
					this._onAcceptCaseMessage(message);
				});
			}

			if (message.kind === MessageKind.jobsAccepted) {
				setImmediate(() => {
					this._onJobAcceptedMessage(message);
				});
			}

			if (message.kind === MessageKind.rejectCase) {
				setImmediate(() => {
					this._onRejectCaseMessage(message);
				});
			}
		});
	}

	public getCases(): IterableIterator<Case> {
		return this._cases.values();
	}

	public getJobHashes(caseHashes: Iterable<CaseHash>): ReadonlySet<JobHash> {
		const jobHashes = new Set<JobHash>();

		for (const caseHash of caseHashes) {
			const caseJobHashes =
				this._caseHashJobHashSetManager.getRightHashesByLeftHash(
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

		for (const kase of this._cases.values()) {
			const jobHashes =
				this._caseHashJobHashSetManager.getRightHashesByLeftHash(
					kase.hash,
				);

			caseWithJobHashes.add({
				...kase,
				jobHashes,
			});
		}

		return caseWithJobHashes;
	}

	protected async _onUpsertCasesMessage(
		message: Message & { kind: MessageKind.upsertCases },
	) {
		message.casesWithJobHashes.map((caseWithJobHash) => {
			this._cases.set(caseWithJobHash.hash, caseWithJobHash);

			for (const jobHash of caseWithJobHash.jobHashes) {
				this._caseHashJobHashSetManager.upsert(
					caseWithJobHash.hash,
					jobHash,
				);
			}
		});

		this._messageBus.publish({
			kind: MessageKind.upsertJobs,
			uriHashFileMap: message.uriHashFileMap,
			jobs: message.jobs,
			inactiveDiagnosticHashes: message.inactiveDiagnosticHashes,
			inactiveJobHashes: message.inactiveJobHashes,
			trigger: message.trigger,
		});
	}

	protected async _onAcceptCaseMessage(
		message: Message & { kind: MessageKind.acceptCase },
	) {
		// we are not removing cases and jobs here
		// we wait for the jobs accepted message for data removal
		const jobHashes =
			this._caseHashJobHashSetManager.getRightHashesByLeftHash(
				message.caseHash,
			);

		this._messageBus.publish({
			kind: MessageKind.acceptJobs,
			caseHash: message.caseHash,
			jobHashes,
		});
	}

	protected async _onJobAcceptedMessage(
		message: Message & { kind: MessageKind.jobsAccepted },
	) {
		for (const jobHash of message.deletedJobHashes) {
			this._caseHashJobHashSetManager.deleteRightHash(jobHash);
		}

		for (const kase of this._cases.values()) {
			const jobHashes =
				this._caseHashJobHashSetManager.getRightHashesByLeftHash(
					kase.hash,
				);

			if (jobHashes.size === 0) {
				this._cases.delete(kase.hash);
			}
		}

		this._messageBus.publish({
			kind: MessageKind.updateElements,
			trigger: 'onCommand',
		});
	}

	protected async _onRejectCaseMessage(
		message: Message & { kind: MessageKind.rejectCase },
	) {
		const deleted = this._cases.delete(message.caseHash);

		if (!deleted) {
			throw new Error('You tried to remove a case that does not exist.');
		}

		const jobHashes =
			this._caseHashJobHashSetManager.getRightHashesByLeftHash(
				message.caseHash,
			);

		for (const jobHash of jobHashes) {
			this._caseHashJobHashSetManager.delete(message.caseHash, jobHash);
		}

		this._messageBus.publish({
			kind: MessageKind.rejectJobs,
			jobHashes,
		});
	}
}
