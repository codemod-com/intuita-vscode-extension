import { CaseManager } from "../cases/caseManager";
import { JobManager } from "../components/jobManager";
import { MessageBus, MessageKind } from "../components/messageBus";
import { PersistedState } from "./codecs";
import { mapCaseToPersistedCase, mapJobToPersistedJob } from "./mappers";

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
                            this.#onPersistStateMessage();
                        }
                    );
                }
            }
        )
    }

    #onPersistStateMessage () {
        const cases = Array.from(this.caseManager.getCases()).map(kase => mapCaseToPersistedCase(kase));
        const caseHashJobHashes = Array.from(this.caseManager.getCaseHashJobHashSetValues());

        const jobs = Array.from(this.jobManager.getJobs()).map(job => mapJobToPersistedJob(job));

        const rejectedJobHashes = Array.from(this.jobManager.getRejectedJobHashes());

        const persistedState: PersistedState = {
            cases,
            caseHashJobHashes,
            jobs,
            rejectedJobHashes,
        }

        

    }
}