import {MessageBus, MessageKind} from "../../messageBus";
import {JobHash} from "../moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, calculateLastPosition, IntuitaPosition, IntuitaRange} from "../../utilities";
import {JobKind, JobOutput} from "../../jobs";
import {JobManager} from "../../components/jobManager";
import {buildRepairCodeFact, RepairCodeFact} from "./factBuilder";
import {buildFileNameHash} from "../moveTopLevelNode/fileNameHash";
import {getOrOpenTextDocuments} from "../../components/vscodeUtilities";
import {RepairCodeUserCommand} from "./userCommand";
import {buildRepairCodeJobHash} from "./jobHash";
import {executeRepairCodeCommand} from "./commandExecutor";

export type RepairCodeJob = Readonly<{
    kind: JobKind.repairCode,
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    replacement: string,
}>;

export class RepairCodeJobManager extends JobManager<RepairCodeFact, RepairCodeJob> {

    public constructor(
        protected readonly _messageBus: MessageBus,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            jobs: ReadonlyArray<RepairCodeJob>,
        ) => void,
    ) {
        super();

        this._messageBus.subscribe(
            async (message) => {
                if (message.kind !== MessageKind.createRepairCodeJob) {
                    return;
                }

                const fileName = message.uri.fsPath;

                const fileNameHash = buildFileNameHash(fileName);

                this._fileNames.set(
                    fileNameHash,
                    fileName
                );

                const textDocuments = await getOrOpenTextDocuments(fileName);
                const fileText = textDocuments[0]?.getText() ?? '';

                const command: RepairCodeUserCommand = {
                    fileName,
                    fileText,
                    kind: "REPAIR_CODE",
                    range: message.range,
                    replacement: message.replacement,
                };

                const fact = buildRepairCodeFact(command);

                this._factMap.set(fileNameHash, fact);

                const jobHash = buildRepairCodeJobHash(
                    fileName,
                    message.range,
                    message.replacement,
                );

                // TODO fix
                this._jobHashMap.set(fileNameHash, new Set([jobHash ]));

                const job: RepairCodeJob = {
                    kind: JobKind.repairCode,
                    fileName,
                    hash: jobHash,
                    title: 'Test',
                    range: message.range,
                    replacement: message.replacement,
                };

                this._jobMap.set(
                    job.hash,
                    job,
                );

                this._setDiagnosticEntry(
                    fileName,
                    [ job ],
                );
            }
        );
    }

    public override executeJob(jobHash: JobHash): JobOutput {
        const job = this._jobMap.get(jobHash);

        assertsNeitherNullOrUndefined(job);

        const fileNameHash = buildFileNameHash(job.fileName);

        const fact = this._factMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(fact);

        const { text, line, character } = executeRepairCodeCommand(fact);

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
