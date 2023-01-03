import Axios from 'axios';
import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { buildSessionId } from './hashes';
import { TelemetryMessage, TELEMETRY_MESSAGE_KINDS } from './types';

export class TelemetryService {
	#messageBus: MessageBus;
	#sessionId: string;

	public constructor(
		messageBus: MessageBus,
	) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe(MessageKind.extensionActivated, () =>
			this.#onExtensionActivatedMessage(),
		);
		this.#messageBus.subscribe(MessageKind.extensionDeactivated, () =>
			this.#onExtensionDisactivatedMessage(),
		);
		this.#messageBus.subscribe(MessageKind.executeCodemodSet, (message) =>
			this.#onExecuteCodemodSetMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.codemodSetExecuted, (message) =>
			this.#onCodemodSetExecutedMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.upsertCases, (message) =>
			this.#onUpsertCasesMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.jobsAccepted, (message) =>
			this.#onJobsAcceptedMessage(message),
		);
		this.#messageBus.subscribe(MessageKind.jobsRejected, (message) =>
			this.#onJobsRejectedMessage(message),
		);

		this.#sessionId = buildSessionId();
	}

	async #onExtensionActivatedMessage() {
		this.#post({
			kind: TELEMETRY_MESSAGE_KINDS.EXTENSION_ACTIVATED,
			sessionId: this.#sessionId,
			happenedAt: String(Date.now()),
		});
	}

	async #onExtensionDisactivatedMessage() {
		await this.#post({
			kind: TELEMETRY_MESSAGE_KINDS.EXTENSION_DEACTIVATED,
			sessionId: this.#sessionId,
			happenedAt: String(Date.now()),
		});
	}

	async #onExecuteCodemodSetMessage(
		message: Message & { kind: MessageKind.executeCodemodSet },
	) {
		await this.#post({
			kind: TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_BEGAN,
			sessionId: this.#sessionId,
			happenedAt: String(Date.now()),
			executionId: message.executionId,
			codemodSetName:
				'group' in message.command ? message.command.group : '',
		});
	}

	async #onCodemodSetExecutedMessage(
		message: Message & { kind: MessageKind.codemodSetExecuted },
	) {
		if (message.halted) {
			await this.#post({
				kind: TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_HALTED,
				sessionId: this.#sessionId,
				happenedAt: String(Date.now()),
				executionId: message.executionId,
				codemodSetName: message.codemodSetName,
			});

			return;
		}

		await this.#post({
			kind: TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_ENDED,
			sessionId: this.#sessionId,
			happenedAt: String(Date.now()),
			executionId: message.executionId,
			codemodSetName: message.codemodSetName,
			fileCount: String(message.fileCount),
		});
	}

	async #onUpsertCasesMessage(
		message: Message & { kind: MessageKind.upsertCases },
	) {
		for (const kase of message.casesWithJobHashes) {
			await this.#post({
				kind: TELEMETRY_MESSAGE_KINDS.JOBS_CREATED,
				sessionId: this.#sessionId,
				happenedAt: String(Date.now()),
				executionId: message.executionId,
				codemodSetName: kase.codemodSetName,
				codemodName: kase.codemodName,
				jobCount: String(kase.jobHashes.size),
			});
		}
	}

	async #onJobsAcceptedMessage(
		message: Message & { kind: MessageKind.jobsAccepted },
	) {
		await this.#post({
			kind: TELEMETRY_MESSAGE_KINDS.JOBS_ACCEPTED,
			sessionId: this.#sessionId,
			happenedAt: String(Date.now()),
			codemodSetName: message.codemodSetName,
			codemodName: message.codemodName,
			jobCount: String(message.deletedJobHashes.size),
		});
	}

	async #onJobsRejectedMessage(
		message: Message & { kind: MessageKind.jobsRejected },
	) {
		await this.#post({
			kind: TELEMETRY_MESSAGE_KINDS.JOBS_REJECTED,
			sessionId: this.#sessionId,
			happenedAt: String(Date.now()),
			codemodSetName: message.codemodSetName,
			codemodName: message.codemodName,
			jobCount: String(message.deletedJobHashes.size),
		});
	}

	async #post(telemetryMessage: TelemetryMessage): Promise<void> {
		const url = this.#buildUrl();

		try {
			await Axios.post(url, telemetryMessage);
		} catch (error) {
			if (!Axios.isAxiosError(error)) {
				console.error(error);
				return;
			}

			console.error(error.response?.data);
		}
	}

	#buildUrl(): string {
		throw new Error("Not implemented");
	}
}
