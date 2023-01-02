import Axios from 'axios';
import { Message, MessageBus, MessageKind } from "../components/messageBus";
import { Configuration } from '../configuration';
import { Container } from '../container';
import { buildSessionId } from './hashes';
import { TelemetryMessage, TELEMETRY_MESSAGE_KINDS } from './types';

export class TelemetryService {
    #configurationContainer: Container<Configuration>;
    #messageBus: MessageBus;
    #sessionId: string;

    public constructor(
        configurationContainer: Container<Configuration>,
        messageBus: MessageBus,
    ) {
        this.#configurationContainer = configurationContainer;
        this.#messageBus = messageBus;

        this.#messageBus.subscribe(MessageKind.extensionActivated, () => this.#onExtensionActivatedMessage());
        this.#messageBus.subscribe(MessageKind.extensionDeactivated, () => this.#onExtensionDisactivatedMessage());
        this.#messageBus.subscribe(MessageKind.executeCodemodSet, (message) => this.#onExecuteCodemodSetMessage(message));
        this.#messageBus.subscribe(MessageKind.upsertCases, (message) => this.#onUpsertCasesMessage(message));


        this.#sessionId = buildSessionId();
    }

    async #onExtensionActivatedMessage() {
        const telemetryMessage: TelemetryMessage = {
            kind: TELEMETRY_MESSAGE_KINDS.EXTENSION_ACTIVATED,
            sessionId: this.#sessionId,
            happenedAt: String(Date.now()),
        }

        this.#post(telemetryMessage);
    }

    async #onExtensionDisactivatedMessage() {
        const telemetryMessage: TelemetryMessage = {
            kind: TELEMETRY_MESSAGE_KINDS.EXTENSION_DEACTIVATED,
            sessionId: this.#sessionId,
            happenedAt: String(Date.now()),
        }

        await this.#post(telemetryMessage);
    }

    async #onExecuteCodemodSetMessage(
        message: Message & { kind: MessageKind.executeCodemodSet },
    ) {
        const telemetryMessage: TelemetryMessage = {
            kind: TELEMETRY_MESSAGE_KINDS.CODEMOD_SET_EXECUTION_BEGAN,
            sessionId: this.#sessionId,
            happenedAt: String(Date.now()),
            executionId: message.executionId,
            codemodSetName: 'group' in message.command ? message.command.group : '',
        }

        await this.#post(telemetryMessage);
    }

    async #onUpsertCasesMessage(
        message: Message & { kind: MessageKind.upsertCases },
    ) {
        const telemetryMessage: TelemetryMessage = {
            kind: TELEMETRY_MESSAGE_KINDS.JOBS_CREATED,
            sessionId: this.#sessionId,
            happenedAt: String(Date.now()),
            executionId: message.executionId,
            codemodSetName: '',
            codemodName: '', // TODO
            jobCount: String(message.jobs.length),
        }

        await this.#post(telemetryMessage);
    }

    async #post(telemetryMessage: TelemetryMessage): Promise<void> {
        const url = this.#buildUrl();

        try {
            await Axios.post(url, telemetryMessage)
        } catch (error) {
            if (!Axios.isAxiosError(error)) {
                console.error(error);
                return;
            }

            console.error(error.response?.data);
        }
    }

    #buildUrl(): string {
        const { telemetryUrl } = this.#configurationContainer.get();

        return `${telemetryUrl}/messages`; // TODO verify the corrrectness of telemetry URL
    }
}