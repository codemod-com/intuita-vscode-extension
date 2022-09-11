import {FileNameHash} from "../features/moveTopLevelNode/fileNameHash";
import {JobHash} from "../features/moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, isNeitherNullNorUndefined} from "../utilities";
import {JobOutput} from "../jobs";

export interface Job {
    fileName: string;
}

export abstract class JobManager<FACT, JOB extends Job> {
    protected _fileNames = new Map<FileNameHash, string>();
    protected _factMap = new Map<FileNameHash, FACT>();
    protected _jobHashMap = new Map<FileNameHash, Set<JobHash>>();
    protected _rejectedJobHashes = new Set<JobHash>();
    protected _jobMap = new Map<JobHash, JOB>;

    public getFileNameFromFileNameHash(fileNameHash: FileNameHash): string | null {
        return this._fileNames.get(fileNameHash) ?? null;
    }

    public getFileNameFromJobHash(
        jobHash: JobHash,
    ): string | null {
        return this._jobMap.get(jobHash)?.fileName ?? null;
    }

    public getFileJobs(): ReadonlyArray<ReadonlyArray<JOB>> {
        return Array.from(this._fileNames.keys()).map(
            (fileNameHash) => {
                const fact = this._factMap.get(fileNameHash);
                const jobHashes = this._jobHashMap.get(fileNameHash);

                assertsNeitherNullOrUndefined(fact);
                assertsNeitherNullOrUndefined(jobHashes);

                return Array.from(jobHashes).map(
                    (jobHash) => {
                        if (this._rejectedJobHashes.has(jobHash)) {
                            return null;
                        }

                        return this._jobMap.get(jobHash);
                    },
                )
                    .filter(isNeitherNullNorUndefined);
            },
        );
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

        return {
            fileName,
            jobs,
        };
    }

    public abstract executeJob(
        jobHash: JobHash,
        characterDifference: number,
    ): JobOutput;
}
