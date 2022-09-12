import {MessageBus, MessageKind} from "../../messageBus";
import {JobHash} from "../moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, calculateLastPosition, IntuitaPosition, IntuitaRange} from "../../utilities";
import {JobKind, JobOutput} from "../../jobs";
import {JobManager} from "../../components/jobManager";
import {buildRepairCodeFact} from "./factBuilder";
import {buildFileNameHash} from "../moveTopLevelNode/fileNameHash";
import {getOrOpenTextDocuments} from "../../components/vscodeUtilities";
import {RepairCodeUserCommand} from "./userCommand";
import {buildRepairCodeJobHash} from "./jobHash";
import {executeRepairCodeCommand} from "./commandExecutor";
import {FactKind} from "../../facts";

export type RepairCodeJob = Readonly<{
    kind: JobKind.repairCode,
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    replacement: string,
}>;

export class RepairCodeJobManager extends JobManager {

    public constructor(
        _messageBus: MessageBus,
        _setDiagnosticEntry: (fileName: string) => void,
    ) {
        super(_messageBus, _setDiagnosticEntry);

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

                const jobHash = buildRepairCodeJobHash(
                    fileName,
                    message.range,
                    message.replacement,
                );

                this._factMap.set(jobHash, fact);

                const jobHashes = this._jobHashMap.get(fileNameHash) ?? new Set();
                jobHashes.add(jobHash);

                this._jobHashMap.set(fileNameHash, jobHashes);

                const job: RepairCodeJob = {
                    kind: JobKind.repairCode,
                    fileName,
                    hash: jobHash,
                    title: 'Test' + message.range.toString(),
                    range: message.range,
                    replacement: message.replacement,
                };

                this._jobMap.set(
                    job.hash,
                    job,
                );

                this._setDiagnosticEntry(fileName);
            }
        );
    }
}
