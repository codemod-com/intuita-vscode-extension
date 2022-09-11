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
import {buildFileNameHash, FileNameHash} from "./fileNameHash";
import {MessageBus, MessageKind} from "../../messageBus";
import {FS_PATH_REG_EXP} from "../../fileSystems/intuitaFileSystem";
import {buildFileUri, buildJobUri} from "../../fileSystems/uris";
import {getOrOpenTextDocuments} from "../../components/vscodeUtilities";
import {FactKind} from "../../facts";
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
        protected readonly _messageBus: MessageBus,
        protected readonly _configurationContainer: Container<Configuration>,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            jobs: ReadonlyArray<MoveTopLevelNodeJob>,
        ) => void,
    ) {
        super();

        // this._messageBus.subscribe(
        //     async (message) => {
        //         if (message.kind !== MessageKind.createRepairCodeJob) {
        //             return;
        //         }
        //
        //         const fileName = message.uri.fsPath;
        //
        //         const fileNameHash = buildFileNameHash(fileName);
        //
        //         this._fileNames.set(
        //             fileNameHash,
        //             fileName
        //         );
        //
        //         const textDocuments = await getOrOpenTextDocuments(fileName);
        //         const fileText = textDocuments[0]?.getText() ?? '';
        //
        //         const command: RepairCodeUserCommand = {
        //             fileName,
        //             fileText,
        //             kind: "REPAIR_CODE",
        //             range: message.range,
        //             replacement: message.replacement,
        //         };
        //
        //         const fact = buildRepairCodeFact(command);
        //
        //         this._factMap.set(fileNameHash, fact);
        //
        //         const jobHash = buildRepairCodeJobHash(
        //             fileName,
        //             message.range,
        //             message.replacement,
        //         );
        //
        //         // TODO fix
        //         this._jobHashMap.set(fileNameHash, new Set([jobHash ]));
        //
        //         const job: IntuitaJob = {
        //             kind: JobKind.repairCode,
        //             fileName,
        //             hash: jobHash,
        //             title: 'Test',
        //             range: message.range,
        //             replacement: message.replacement,
        //         };
        //
        //         this._jobMap.set(
        //             job.hash,
        //             job,
        //         );
        //
        //         this._setDiagnosticEntry(
        //             fileName,
        //             [ job ],
        //         );
        //     }
        // );
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

        if (fact.kind !== FactKind.moveTopLevelNode) {
            return [];
        }

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

    public override executeJob(
        jobHash: JobHash,
        characterDifference: number,
    ): JobOutput {
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

        const fact = this._factMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(fact);

        if(fact.kind !== FactKind.moveTopLevelNode) {
            throw new Error('Could not find a moveTopLevelNode fact with the specified hash');
        }

        const execution = executeMoveTopLevelNodeAstCommandHelper(
            oldIndex,
            newIndex,
            characterDifference,
            fact.stringNodes,
            fact.separator,
        );

        const { text, line, character } = execution;

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

        // if (job.kind === JobKind.repairCode) {
        // const fileNameHash = buildFileNameHash(job.fileName);
        //
        // const fact = this._factMap.get(fileNameHash);
        //
        // assertsNeitherNullOrUndefined(fact);
        //
        // if (fact.kind !== FactKind.repairCode) {
        //     throw new Error('Could not find a repairCode fact with the specified hash');
        // }
        //
        // const { text, line, character } = executeRepairCodeCommand(fact);
        //
        // // TODO revisit it
        // const lastPosition = calculateLastPosition(text, fact.separator);
        //
        // const range: IntuitaRange = [
        //     0,
        //     0,
        //     lastPosition[0],
        //     lastPosition[1],
        // ];
        //
        // const position: IntuitaPosition = [
        //     line,
        //     character,
        // ];
        //
        // return {
        //     range,
        //     text,
        //     position,
        // };
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
