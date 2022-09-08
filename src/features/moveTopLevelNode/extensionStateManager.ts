import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    assertsNeitherNullOrUndefined,
    calculateCharacterIndex,
    calculateLastPosition,
    calculatePosition,
    getSeparator,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommandHelper} from "./4_astCommandExecutor";
import * as vscode from "vscode";
import {Container} from "../../container";
import { buildJobHash, JobHash } from "./jobHash";
import { buildFileNameHash, FileNameHash } from "./fileNameHash";
import { MessageBus, MessageKind } from "../../messageBus";
import { FS_PATH_REG_EXP } from "../../fileSystems/intuitaFileSystem";
import { buildFileUri, buildJobUri } from "../../fileSystems/uris";
import { getOrOpenTextDocuments } from "../../components/vscodeUtilities";

export const enum JobKind {
    moveTopLevelNode = 1,
    codeRepair = 2,
}

export type IntuitaJob = 
    | Readonly<{
        kind: JobKind.moveTopLevelNode,
        fileName: string,
        hash: JobHash,
        title: string,
        range: IntuitaRange,
        oldIndex: number,
        newIndex: number,
        score: [number, number],
    }>
    | Readonly<{
        kind: JobKind.codeRepair,
        fileName: string,
        hash: JobHash,
        title: string,
        range: IntuitaRange,
    }>;

export type IntuitaCodeAction = Readonly<{
    title: string,
    characterDifference: number,
    oldIndex: number,
    newIndex: number,
}>;

export type JobOutput = Readonly<{
    text: string,
    range: IntuitaRange,
    position: IntuitaPosition,
}>;

export class ExtensionStateManager {
    protected _fileNames = new Map<FileNameHash, string>();
    protected _factMap = new Map<FileNameHash, MoveTopLevelNodeFact>();
    protected _jobHashMap = new Map<FileNameHash, Set<JobHash>>();
    protected _rejectedJobHashes = new Set<JobHash>();
    protected _jobMap = new Map<JobHash, IntuitaJob>;

    public constructor(
        protected readonly _messageBus: MessageBus,
        protected readonly _configurationContainer: Container<Configuration>,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            jobs: ReadonlyArray<IntuitaJob>,
        ) => void,
    ) {
    }

    public getFileNameFromFileNameHash(fileNameHash: FileNameHash): string | null {
        return this._fileNames.get(fileNameHash) ?? null;
    }

    public getFileNameFromJobHash(
        jobHash: JobHash,
    ): string | null {
        return this._jobMap.get(jobHash)?.fileName ?? null;
    }

    public getFileJobs(): ReadonlyArray<ReadonlyArray<IntuitaJob>> {
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

        this._setDiagnosticEntry(
            fileName,
            jobs,
        );

        const uri = buildJobUri(jobHash);

        this._messageBus.publish(
            {
                kind: MessageKind.changePermissions,
                uri,
                permissions: vscode.FilePermission.Readonly,
            },
        );
    }

    public onFileTextChanged(
        document: vscode.TextDocument,
    ) {
        if (document.uri.scheme !== 'file') {
            return;
        }

        const { fileName } = document;
        const fileText = document.getText();

        const userCommand: MoveTopLevelNodeUserCommand = {
            kind: 'MOVE_TOP_LEVEL_NODE',
            fileName,
            fileText,
            options: this._configurationContainer.get(),
        };

        const fact = buildMoveTopLevelNodeFact(userCommand);

        if (!fact) {
            return;
        }

        const jobs: ReadonlyArray<IntuitaJob> = fact.solutions.map<IntuitaJob | null>(
            (solution) => {
                const { oldIndex, newIndex, score } = solution;

                const topLevelNode = fact.topLevelNodes[oldIndex] ?? null;

                if (topLevelNode === null) {
                    return null;
                }

                const title = buildTitle(solution, false) ?? '';

                const start = calculatePosition(
                    fact.separator,
                    fact.lengths,
                    topLevelNode.nodeStart,
                );

                const range: IntuitaRange = [
                    start[0],
                    start[1],
                    start[0],
                    fact.lengths[start[0]] ?? start[1],
                ];

                const hash = buildJobHash(
                    fileName,
                    oldIndex,
                    newIndex,
                );

                if (this._rejectedJobHashes.has(hash)) {
                    return null;
                }

                return {
                    kind: JobKind.moveTopLevelNode,
                    fileName,
                    hash,
                    range,
                    title,
                    oldIndex,
                    newIndex,
                    score,
                };
            }
        )
            .filter(isNeitherNullNorUndefined);

        const fileNameHash = buildFileNameHash(fileName);

        const oldJobHashes = this._jobHashMap.get(fileNameHash);

        this._fileNames.set(fileNameHash, fileName);
        this._factMap.set(fileNameHash, fact);

        const jobHashes = new Set(
            jobs.map(({ hash }) => hash)
        );

        this._jobHashMap.set(fileNameHash, jobHashes);
        
        jobs.forEach((job) => {
            this._jobMap.set(
                job.hash,
                job,
            );
        });

        this._setDiagnosticEntry(
            fileName,
            jobs,
        );

        oldJobHashes?.forEach(
            (oldJobHash) => {
                if (jobHashes.has(oldJobHash)) {
                    return;
                }

                const uri = buildJobUri(oldJobHash);

                this._messageBus.publish(
                    {
                        kind: MessageKind.deleteFile,
                        uri,
                    },
                );
            },
        );

        const uri = buildFileUri(fileNameHash);

        if (jobs.length === 0) {
            this._messageBus.publish(
                {
                    kind: MessageKind.deleteFile,
                    uri,
                },
            );
        } else {
            this._messageBus.publish(
                {
                    kind: MessageKind.writeFile,
                    uri,
                    content: Buffer.from(fileText),
                    permissions: vscode.FilePermission.Readonly,
                },
            );
        }
    }

    public findCodeActions(
        fileName: string,
        position: IntuitaPosition,
    ): ReadonlyArray<IntuitaCodeAction> {
        const fileNameHash = buildFileNameHash(fileName);

        const fact = this._factMap.get(fileNameHash);
        const jobHashes = this._jobHashMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(fact);
        assertsNeitherNullOrUndefined(jobHashes);

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
                ({ title }) => {
                    const characterIndex = calculateCharacterIndex(
                        fact.separator,
                        fact.lengths,
                        position[0],
                        position[1],
                    );

                    const topLevelNodeIndex = fact
                        .topLevelNodes
                        .findIndex(
                        (topLevelNode) => {
                            return topLevelNode.triviaStart <= characterIndex
                                && characterIndex <= topLevelNode.triviaEnd;
                        }
                    );

                    const topLevelNode = fact.topLevelNodes[topLevelNodeIndex] ?? null;

                    if (topLevelNodeIndex === -1 || topLevelNode === null) {
                        return null;
                    }

                    const solutions = fact
                        .solutions
                        .filter(isNeitherNullNorUndefined)
                        .filter(
                            (solution) => {
                                return solution.oldIndex === topLevelNodeIndex;
                            }
                        );

                    const solution = solutions[0] ?? null;

                    if (solution === null) {
                        return null;
                    }

                    const characterDifference = characterIndex - topLevelNode.triviaStart;

                    const {
                        oldIndex,
                        newIndex,
                    } = solution;

                    return {
                        title,
                        characterDifference,
                        oldIndex,
                        newIndex,
                    };
                }
            )
            .filter(isNeitherNullNorUndefined);
    }

    public executeJob(
        jobHash: JobHash,
        characterDifference: number,
    ): JobOutput {
        const job = this._jobMap.get(jobHash);

        if (!job) {
            throw new Error('Could not find a job with the specified hash');
        }

        if (job.kind === JobKind.moveTopLevelNode) {
            const {
                fileName,
                oldIndex,
                newIndex,
            } = job;
    
            const fileNameHash = buildFileNameHash(fileName);
    
            const fact = this._factMap.get(fileNameHash);
            
            assertsNeitherNullOrUndefined(fact);

            const execution = executeMoveTopLevelNodeAstCommandHelper(
                fileName,
                oldIndex,
                newIndex,
                characterDifference,
                fact.stringNodes,
            );

            const { text, line, character } = execution;

            const separator = getSeparator(text);
            const lastPosition = calculateLastPosition(text, separator);

            const range: IntuitaRange = [
                0,
                0,
                lastPosition[0],
                lastPosition[1],
            ];

            const position: IntuitaPosition = [
                line,
                character,
            ];

            return {
                range,
                text,
                position,
            };
        }

        throw new Error('Not implemented yet');        
    }

    public async onReadingFileFailed (
        uri: vscode.Uri
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
            ? vscode.FilePermission.Readonly
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