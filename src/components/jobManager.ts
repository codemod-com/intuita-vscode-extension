import {buildFileNameHash, FileNameHash} from "../features/moveTopLevelNode/fileNameHash";
import {JobHash} from "../features/moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, IntuitaPosition, isNeitherNullNorUndefined} from "../utilities";
import {JobOutput} from "../jobs";
import {FilePermission, Uri} from "vscode";
import {getOrOpenTextDocuments} from "./vscodeUtilities";
import {MessageBus, MessageKind} from "../messageBus";
import {buildJobUri, destructIntuitaFileSystemUri} from "../fileSystems/uris";
import {
    calculateCharacterDifference,
    MoveTopLevelNodeJob
} from "../features/moveTopLevelNode/moveTopLevelNodeJobManager";
import {RepairCodeJob} from "../features/repairCode/repairCodeJobManager";
import {RepairCodeFact} from "../features/repairCode/factBuilder";
import {MoveTopLevelNodeFact} from "../features/moveTopLevelNode/2_factBuilders";
import {FactKind} from "../facts";

type Job = MoveTopLevelNodeJob | RepairCodeJob;
type Fact = MoveTopLevelNodeFact | RepairCodeFact;

export abstract class JobManager {
    protected _messageBus: MessageBus;
    protected _setDiagnosticEntry: (fileName: string) => void;

    protected _fileNames = new Map<FileNameHash, string>();
    protected _factMap = new Map<JobHash, Fact>();
    protected _jobHashMap = new Map<FileNameHash, Set<JobHash>>();
    protected _rejectedJobHashes = new Set<JobHash>();
    protected _jobMap = new Map<JobHash, Job>;

    public constructor(
        messageBus: MessageBus,
        setDiagnosticEntry: (fileName: string) => void,
    ) {
        this._messageBus = messageBus;
        this._setDiagnosticEntry = setDiagnosticEntry;
    }

    public getFileNameFromFileNameHash(fileNameHash: FileNameHash): string | null {
        return this._fileNames.get(fileNameHash) ?? null;
    }

    public getFileNameFromJobHash(
        jobHash: JobHash,
    ): string | null {
        return this._jobMap.get(jobHash)?.fileName ?? null;
    }

    public getFileNames() {
        return Array.from(this._fileNames.values());
    }

    public getFileJobs(fileNameHash: FileNameHash): ReadonlyArray<Job> {
        const jobHashes = this._jobHashMap.get(fileNameHash) ?? new Set();

        return Array.from(jobHashes).map(
            (jobHash) => {
                if (this._rejectedJobHashes.has(jobHash)) {
                    return null;
                }

                return this._jobMap.get(jobHash);
            },
        )
            .filter(isNeitherNullNorUndefined);
    }

    public rejectJob(
        jobHash: JobHash,
    ) {
        const entries = Array.from(this._jobHashMap.entries());

        const entry = entries.find(([ _, jobHashes]) => {
            return jobHashes.has(jobHash);
        });

        assertsNeitherNullOrUndefined(entry);

        const [ fileNameHash, jobHashes ] = entry;

        const fileName = this._fileNames.get(fileNameHash);

        assertsNeitherNullOrUndefined(fileName);

        jobHashes.delete(jobHash);

        this._rejectedJobHashes.add(jobHash);
        this._jobMap.delete(jobHash);

        const jobs = Array.from(jobHashes).map(
            (jobHash) => {
                return this._jobMap.get(jobHash);
            },
        )
            .filter(isNeitherNullNorUndefined);

        this._setDiagnosticEntry(fileName);

        const uri = buildJobUri(jobHash);

        this._messageBus.publish(
            {
                kind: MessageKind.changePermissions,
                uri,
                permissions: FilePermission.Readonly,
            },
        );
    }

    public abstract executeJob(
        jobHash: JobHash,
        characterDifference: number,
    ): JobOutput;

    public async onReadingFileFailed (
        uri: Uri
    ) {
        const destructedUri = destructIntuitaFileSystemUri(uri);

        if (!destructedUri) {
            return;
        }

        const fileName = destructedUri.directory === 'files'
            ? this.getFileNameFromFileNameHash(destructedUri.fileNameHash)
            : this.getFileNameFromJobHash(destructedUri.jobHash);

        assertsNeitherNullOrUndefined(fileName);

        const textDocument = await getOrOpenTextDocuments(fileName);
        let text = textDocument[0]?.getText();

        assertsNeitherNullOrUndefined(text);

        if (destructedUri.directory === 'jobs') {
            const result = this
                .executeJob(
                    destructedUri.jobHash,
                    0,
                );

            if (result) {
                text = result.text;
            }
        }

        assertsNeitherNullOrUndefined(text);

        const content = Buffer.from(text);

        const permissions = destructedUri.directory === 'files'
            ? FilePermission.Readonly
            : null;

        this._messageBus.publish(
            {
                kind: MessageKind.writeFile,
                uri,
                content,
                permissions,
            },
        );
    }

    public findCodeActions(
        fileName: string,
        position: IntuitaPosition,
    ): ReadonlyArray<Job & { characterDifference: number }> {
        const fileNameHash = buildFileNameHash(fileName);

        const jobHashes = this._jobHashMap.get(fileNameHash) ?? new Set();

        const jobs = Array.from(jobHashes.keys()).map(
            (jobHash) => {
                if (this._rejectedJobHashes.has(jobHash)) {
                    return null;
                }

                return this._jobMap.get(jobHash);
            }
        )
            .filter(isNeitherNullNorUndefined);


        return jobs
            .filter(
                ({ range }) => {
                    return range[0] <= position[0]
                        && range[2] >= position[0]
                        && range[1] <= position[1]
                        && range[3] >= position[1];
                },
            )
            .map(
                (job) => {
                    const fact = this._factMap.get(job.hash);

                    assertsNeitherNullOrUndefined(fact);

                    const characterDifference = fact.kind === FactKind.moveTopLevelNode
                        ? calculateCharacterDifference(fact, position)
                        : 0;

                    return {
                        ...job,
                        characterDifference,
                    };
                }
            )
            .filter(isNeitherNullNorUndefined);
    }
}
