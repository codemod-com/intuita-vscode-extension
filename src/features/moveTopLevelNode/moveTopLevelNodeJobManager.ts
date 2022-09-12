import {Configuration} from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
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
import {Solution} from "./2_factBuilders/solutions";
import {FactKind} from "../../facts";

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

const buildIdentifiersLabel = (
    identifiers: ReadonlyArray<string>,
    useHtml: boolean,
): string => {
    const label = identifiers.length > 1
        ? `(${identifiers.join(' ,')})`
        : identifiers.join('');

    if (!useHtml) {
        return label;
    }

    return `<b>${label}</b>`;
};
export const buildTitle = (
    solution: Solution,
    useHtml: boolean,
): string | null => {
    const {
        nodes,
        newIndex,
    } = solution;

    const node = nodes[newIndex];

    if (!node) {
        return null;
    }

    let nodeIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            node.identifiers
        ),
        useHtml,
    );

    const otherNode = newIndex === 0
        ? nodes[1]
        : nodes[newIndex - 1];

    if (!otherNode) {
        return null;
    }

    const orderLabel = newIndex === 0
        ? 'before'
        : 'after';

    const otherIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            otherNode.identifiers
        ),
        useHtml,
    );

    return `Move ${nodeIdentifiersLabel} ${orderLabel} ${otherIdentifiersLabel}`;
};

const buildMoveTopLevelNodeJobs = (
    userCommand: MoveTopLevelNodeUserCommand,
    fact: MoveTopLevelNodeFact,
    rejectedJobHashes: ReadonlySet<JobHash>,
): ReadonlyArray<MoveTopLevelNodeJob> => {
    return fact.solutions.map<MoveTopLevelNodeJob | null>(
        (solution) => {
            const { oldIndex, newIndex } = solution;

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
                userCommand.fileName,
                oldIndex,
                newIndex,
            );

            if (rejectedJobHashes.has(hash)) {
                return null;
            }

            return {
                kind: JobKind.moveTopLevelNode,
                fileName: userCommand.fileName,
                hash,
                range,
                title,
                oldIndex,
                newIndex,
                score: solution.score,
            };
        }
    )
        .filter(isNeitherNullNorUndefined);
};

export const calculateCharacterDifference = (
    fact: MoveTopLevelNodeFact,
    position: IntuitaPosition,
): number => {
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

    assertsNeitherNullOrUndefined(topLevelNode);

    return characterIndex - topLevelNode.triviaStart;
};

export class MoveTopLevelNodeJobManager extends JobManager{
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

        const jobs = buildMoveTopLevelNodeJobs(userCommand, fact, this._rejectedJobHashes);

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

        // TODO check all the jobs

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

    public override executeJob(
        jobHash: JobHash,
        characterDifference: number,
    ): JobOutput {
        const job = this._jobMap.get(jobHash);
        const fact = this._factMap.get(jobHash);

        assertsNeitherNullOrUndefined(job);
        assertsNeitherNullOrUndefined(fact);

        // TODO
        if (job.kind === JobKind.moveTopLevelNode && fact.kind === FactKind.moveTopLevelNode) {
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

        throw new Error('Not implemented');
    }
}
