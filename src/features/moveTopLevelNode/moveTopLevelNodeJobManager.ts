import {Configuration} from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    assertsNeitherNullOrUndefined,
    calculateCharacterIndex,
    calculateLastPosition,
    calculatePosition,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommandHelper} from "./4_astCommandExecutor";
import * as vscode from "vscode";
import {Container} from "../../container";
import {buildMoveTopLevelNodeJobHash, JobHash} from "./jobHash";
import {buildFileNameHash} from "./fileNameHash";
import {MessageBus, MessageKind} from "../../messageBus";
import {buildFileUri, buildJobUri} from "../../fileSystems/uris";
import {JobKind, JobOutput} from "../../jobs";
import {JobManager} from "../../components/jobManager";

export type IntuitaCodeAction = Readonly<{
    title: string,
    characterDifference: number,
    oldIndex: number,
    newIndex: number,
}>;

export type MoveTopLevelNodeJob = Readonly<{
    kind: JobKind.moveTopLevelNode,
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    oldIndex: number,
    newIndex: number,
    score: [number, number],
}>;

export class MoveTopLevelNodeJobManager extends JobManager<MoveTopLevelNodeFact, MoveTopLevelNodeJob>{
    public constructor(
        _messageBus: MessageBus,
        protected readonly _configurationContainer: Container<Configuration>,
        _setDiagnosticEntry: (
            fileName: string,
        ) => void,
    ) {
        super(_messageBus, _setDiagnosticEntry);
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

        const jobs: ReadonlyArray<MoveTopLevelNodeJob> = fact.solutions.map<MoveTopLevelNodeJob | null>(
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

                const hash = buildMoveTopLevelNodeJobHash(
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

        const jobHashes = new Set(
            jobs.map(({ hash }) => hash)
        );

        jobHashes.forEach((jobHash) => {
            this._factMap.set(jobHash, fact);
        });

        this._jobHashMap.set(fileNameHash, jobHashes);

        jobs.forEach((job) => {
            this._jobMap.set(
                job.hash,
                job,
            );
        });

        this._setDiagnosticEntry(fileName);

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

        const jobHashes = this._jobHashMap.get(fileNameHash);

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
                ({ title, hash }) => {
                    const fact = this._factMap.get(hash);

                    assertsNeitherNullOrUndefined(fact);

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

    public override executeJob(
        jobHash: JobHash,
        characterDifference: number,
    ): JobOutput {
        const job = this._jobMap.get(jobHash);
        const fact = this._factMap.get(jobHash);

        assertsNeitherNullOrUndefined(job);
        assertsNeitherNullOrUndefined(fact);

        const {
            oldIndex,
            newIndex,
        } = job;

        const execution = executeMoveTopLevelNodeAstCommandHelper(
            oldIndex,
            newIndex,
            characterDifference,
            fact.stringNodes,
            fact.separator,
        );

        const { text, line, character } = execution;

        // TODO revisit it
        const lastPosition = calculateLastPosition(text, fact.separator);

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
}
