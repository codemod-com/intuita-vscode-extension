import {MessageBus, MessageKind} from "../../messageBus";
import {JobHash} from "../moveTopLevelNode/jobHash";
import {assertsNeitherNullOrUndefined, calculateLastPosition, IntuitaPosition, IntuitaRange} from "../../utilities";
import {JobKind, JobOutput} from "../../jobs";
import {JobManager} from "../../components/jobManager";
import {buildRepairCodeFact, RepairCodeFact} from "./factBuilder";
import {buildFileNameHash, FileNameHash} from "../moveTopLevelNode/fileNameHash";
import {getOrOpenTextDocuments} from "../../components/vscodeUtilities";
import {RepairCodeUserCommand} from "./userCommand";
import {buildRepairCodeJobHash} from "./jobHash";
import {executeRepairCodeCommand} from "./commandExecutor";
import { FilePermission, Uri } from "vscode";
import { FS_PATH_REG_EXP } from "../../fileSystems/intuitaFileSystem";

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

    public override executeJob(jobHash: JobHash): JobOutput {
        const job = this._jobMap.get(jobHash);
        const fact = this._factMap.get(jobHash);

        assertsNeitherNullOrUndefined(job);
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
