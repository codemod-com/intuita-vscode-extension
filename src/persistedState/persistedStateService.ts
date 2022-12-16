import { CaseManager } from "../cases/caseManager";
import { JobManager } from "../components/jobManager";
import { Message, MessageBus, MessageKind } from "../components/messageBus";
import { PersistedState } from "./codecs";
import { mapCaseToPersistedCase } from "./mappers";

export class PersistedStateService {
    constructor(
        private readonly caseManager: CaseManager,
        private readonly jobManager: JobManager,
        private readonly messageBus: MessageBus,
    ) {
        this.messageBus.subscribe(
            (message) => {
                if (message.kind === MessageKind.persistState) {
                    setImmediate(
                        () => {
                            this.#onPersistStateMessage(message);
                        }
                    );
                }
            }
        )
    }

    #onPersistStateMessage (message: Message & { kind: MessageKind.persistState }) {
        const cases = Array.from(this.caseManager.getCases()).map(kase => mapCaseToPersistedCase(kase));

        const caseHashJobHashes = Array.from(this.caseManager.getCaseHashJobHashSetValues());

        const persistedState: PersistedState = {
            cases,
            caseHashJobHashes,
        }

    }
}