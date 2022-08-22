import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand, RangeCriterion} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    assertsNeitherNullOrUndefined,
    buildHash,
    calculateCharacterIndex,
    calculatePosition,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommandHelper} from "./4_astCommandExecutor";
import * as vscode from "vscode";
import {Container} from "../../container";
import { buildJobHash, JobHash } from "./jobHash";
import { buildFileNameHash, FileNameHash } from "./fileNameHash";

export type IntuitaJob = Readonly<{
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    oldIndex: number,
    newIndex: number,
    score: number,
}>;

export type IntuitaCodeAction = Readonly<{
    title: string,
    characterDifference: number,
    oldIndex: number,
    newIndex: number,
}>;

export class ExtensionStateManager {
    protected _documentMap = new Map<FileNameHash, vscode.TextDocument>();
    protected _factMap = new Map<FileNameHash, MoveTopLevelNodeFact>();
    protected _jobHashMap = new Map<FileNameHash, Set<JobHash>>();
    protected _rejectedJobHashes = new Set<JobHash>();
    protected _jobMap = new Map<JobHash, IntuitaJob>;

    public constructor(
        protected readonly _configurationContainer: Container<Configuration>,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            jobs: ReadonlyArray<IntuitaJob>,
        ) => void,
    ) {

    }

    // TODO: change name
    public getDocuments() {
        const fileNameHashes = Array.from(
            this._documentMap.keys()
        );

        return fileNameHashes.map(
            (fileNameHash) => {
                const document = this._documentMap.get(fileNameHash);
                const fact = this._factMap.get(fileNameHash);
                const jobHashes = this._jobHashMap.get(fileNameHash);

                assertsNeitherNullOrUndefined(document);
                assertsNeitherNullOrUndefined(fact);
                assertsNeitherNullOrUndefined(jobHashes);
                
                const jobs = Array.from(jobHashes).map(
                    (jobHash) => {
                        if (this._rejectedJobHashes.has(jobHash)) {
                            return null;
                        }

                        return this._jobMap.get(jobHash);
                    },
                )
                    .filter(isNeitherNullNorUndefined);

                return {
                    document,
                    fact,
                    jobs,
                };
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

        const document = this._documentMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(document);

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
            document.fileName,
            jobs,
        );
    }

    public onFileTextChanged(
        document: vscode.TextDocument,
        rangeCriterion: RangeCriterion,
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
            rangeCriterion,
        };

        const fact = buildMoveTopLevelNodeFact(userCommand);

        const jobs: ReadonlyArray<IntuitaJob> = fact.solutions.map(
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

        this._documentMap.set(fileNameHash, document);
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

    public getText(
        jobHash: JobHash,
    ): string {
        const data = this._getExecution(
            jobHash,
            0,
        );

        return data?.execution.text ?? '';
    }

    public executeCommand(
        jobHash: JobHash,
        characterDifference: number,
    ) {
        const data = this._getExecution(
            jobHash,
            characterDifference,
        );

        if (!data) {
            return null;
        }

        const {
            execution,
            fileText,
        } = data;

        const { name, text, line, character } = execution;

        if (name !== data.fileName) {
            return null;
        }

        const oldLines = fileText.split('\n');
        const oldTextLastLineNumber = oldLines.length - 1;
        const oldTextLastCharacter = oldLines[oldLines.length - 1]?.length ?? 0;

        const range: IntuitaRange = [
            0,
            0,
            oldTextLastLineNumber,
            oldTextLastCharacter,
        ];

        const position: IntuitaPosition = [
            line,
            character,
        ];

        return {
            fileName: data.fileName,
            range,
            text,
            position,
        };
    }

    protected _getExecution(
        jobHash: JobHash,
        characterDifference: number,
    ) {
        const job = this._jobMap.get(jobHash);

        if (!job) {
            throw new Error('Could not find a job with the specified hash');
        }

        const {
            fileName,
            oldIndex,
            newIndex,
        } = job;

        const fileNameHash = buildFileNameHash(fileName);

        const document = this._documentMap.get(fileNameHash);
        const fact = this._factMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(document);
        assertsNeitherNullOrUndefined(fact);

        const fileText = document.getText();

        const {
            stringNodes,
        } = fact;

        const executions = executeMoveTopLevelNodeAstCommandHelper(
            fileName,
            oldIndex,
            newIndex,
            characterDifference,
            stringNodes,
        );

        const execution = executions[0] ?? null;

        if (!execution) {
            return null;
        }

        return {
            execution,
            fileName,
            fileText,
        };
    }
}