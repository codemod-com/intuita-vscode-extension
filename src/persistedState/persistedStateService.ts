import { FileSystem, Uri, WorkspaceFolder } from "vscode";
import { CaseManager } from "../cases/caseManager";
import { JobManager } from "../components/jobManager";
import { MessageBus, MessageKind } from "../components/messageBus";
import { PersistedState } from "./codecs";
import { mapCaseToPersistedCase, mapJobToPersistedJob } from "./mappers";

export class PersistedStateService {
    constructor(
        private readonly caseManager: CaseManager,
        private readonly fileSystem: FileSystem,
        private readonly getWorkspaceFolders: () => ReadonlyArray<WorkspaceFolder>,
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

    async #onPersistStateMessage () {
        const workspaceFolders = this.getWorkspaceFolders();

        const uri = workspaceFolders[0]?.uri;

        if (!uri) {
            console.error("No workspace folder found. We cannot persist the state anywhere.");

            return;
        }

        const persistedState = this.#buildPersistedState();
        const buffer = Buffer.from(JSON.stringify(persistedState));

        const intuitaDirectoryUri = Uri.joinPath(uri, ".intuita");
        await this.fileSystem.createDirectory(intuitaDirectoryUri);

        const localStateUri = Uri.joinPath(intuitaDirectoryUri, "localState.json");
        this.fileSystem.writeFile(localStateUri, buffer);
    }

    #buildPersistedState(): PersistedState {
        const cases = Array.from(this.caseManager.getCases()).map(kase => mapCaseToPersistedCase(kase));
        const caseHashJobHashes = Array.from(this.caseManager.getCaseHashJobHashSetValues());

        const jobs = Array.from(this.jobManager.getJobs()).map(job => mapJobToPersistedJob(job));
        const rejectedJobHashes = Array.from(this.jobManager.getRejectedJobHashes());

        return {
            cases,
            caseHashJobHashes,
            jobs,
            rejectedJobHashes,
        }
    }
}