import {FileNameHash} from "../features/moveTopLevelNode/fileNameHash";
import {JobHash} from "../features/moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, isNeitherNullNorUndefined} from "../utilities";
import {JobOutput} from "../jobs";
import {FilePermission, Uri} from "vscode";
import {FS_PATH_REG_EXP} from "../fileSystems/intuitaFileSystem";
import {getOrOpenTextDocuments} from "./vscodeUtilities";
import {MessageBus, MessageKind} from "../messageBus";
import {buildJobUri} from "../fileSystems/uris";

export interface Job {
    fileName: string;
}

export abstract class JobManager<FACT, JOB extends Job> {
    protected _messageBus: MessageBus;
    protected _setDiagnosticEntry: (fileName: string) => void;

    protected _fileNames = new Map<FileNameHash, string>();
    protected _factMap = new Map<JobHash, FACT>();
    protected _jobHashMap = new Map<FileNameHash, Set<JobHash>>();
    protected _rejectedJobHashes = new Set<JobHash>();
    protected _jobMap = new Map<JobHash, JOB>;

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

    public getFileJobs(fileNameHash: FileNameHash): ReadonlyArray<JOB> {
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
        if (uri.scheme !== 'intuita') {
            return;
        }

        const regExpExecArray = FS_PATH_REG_EXP.exec(uri.fsPath);

        if (!regExpExecArray) {
            throw new Error(`The fsPath of the URI (${uri.fsPath}) does not belong to the Intuita File System`);
        }

        const directory = regExpExecArray[1];

        const permissions = directory === 'files'
            ? FilePermission.Readonly
            : null;

        const fileName = directory === 'files'
            ? this.getFileNameFromFileNameHash(
                regExpExecArray[2] as FileNameHash
            )
            : this.getFileNameFromJobHash(
                regExpExecArray[2] as JobHash
            );

        assertsNeitherNullOrUndefined(fileName);

        const textDocument = await getOrOpenTextDocuments(fileName);
        let text = textDocument[0]?.getText();

        assertsNeitherNullOrUndefined(text);

        if (directory === 'jobs') {
            const result = this
                .executeJob(
                    regExpExecArray[2] as JobHash,
                    0,
                );

            if (result) {
                text = result.text;
            }
        }

        if (!text) {
            return;
        }

        const content = Buffer.from(text);

        this._messageBus.publish(
            {
                kind: MessageKind.writeFile,
                uri,
                content,
                permissions,
            },
        );
    }
}
