import { JobManager } from '../components/jobManager';
import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { JobHash } from '../jobs/types';
import { LeftRightHashSetManager } from '../leftRightHashes/leftRightHashSetManager';
import { Case, CaseWithJobHashes, CaseHash } from './types';

export class CaseManager {
	protected readonly _cases = new Map<CaseHash, Case>();
	protected readonly _caseHashJobHashSetManager = new LeftRightHashSetManager<
		CaseHash,
		JobHash
	>();

	public constructor(
		protected readonly _messageBus: MessageBus,
		protected readonly _jobManager: JobManager,
	) {
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

	public getJobHashes(
		caseHashes: ReadonlyArray<CaseHash>,
	): ReadonlyArray<JobHash> {
		return caseHashes.flatMap((caseHash) =>
			this._caseHashJobHashSetManager.getRightHashesByLeftHash(caseHash),
		);
	}

	public getCasesWithJobHashes(): ReadonlyArray<CaseWithJobHashes> {
		return Array.from(this._cases.values()).map((_case) => {
			const jobHashes =
				this._caseHashJobHashSetManager.getRightHashesByLeftHash(
					_case.hash,
				);

			return {
				..._case,
				jobHashes,
			};
		});
	}

	protected async _onUpsertCasesMessage(
		message: Message & { kind: MessageKind.upsertCases },
	) {
		message.casesWithJobHashes.map((casesWithJobHash) => {
			const kase = {
				hash: casesWithJobHash.hash,
				kind: casesWithJobHash.kind,
				code: casesWithJobHash.code,
				node: casesWithJobHash.node,
			};

			this._cases.set(kase.hash, kase);

			for (const jobHash of casesWithJobHash.jobHashes) {
				this._caseHashJobHashSetManager.upsert(
					casesWithJobHash.hash,
					jobHash,
				);
			}
		});

		this._messageBus.publish({
			kind: MessageKind.upsertJobs,
			uriHashFileMap: message.uriHashFileMap,
			jobs: message.jobs,
			inactiveHashes: message.inactiveHashes,
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
		if (message.caseHash) {
			for (const jobHash of message.jobHashes) {
				this._caseHashJobHashSetManager.delete(
					message.caseHash,
					jobHash,
				);
			}

			const jobHashes =
				this._caseHashJobHashSetManager.getRightHashesByLeftHash(
					message.caseHash,
				);

			if (!jobHashes.length) {
				this._cases.delete(message.caseHash);
			}
		}

		this._messageBus.publish({
			kind: MessageKind.updateInternalDiagnostics,
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
