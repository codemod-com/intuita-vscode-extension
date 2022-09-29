import {JobHash} from "../moveTopLevelNode/jobHash";
import {buildIntuitaSimpleRange, IntuitaRange, IntuitaSimpleRange} from "../../utilities";
import {JobKind} from "../../jobs";
import { InferenceJob } from "../../components/inferenceService";
import { buildRepairCodeJobHash } from "./jobHash";

export type RepairCodeJob = Readonly<{
    kind: JobKind.repairCode,
    fileName: string,
    version: number,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    replacement: string,
    fileText: string,
    simpleRange: IntuitaSimpleRange,
    separator: string,
}>;

export const buildRepairCodeJobs = (
    fileName: string,
    fileText: string,
    inferenceJobs: ReadonlyArray<InferenceJob>,
    separator: string,
    lengths: ReadonlyArray<number>,
    version: number,
): ReadonlyArray<RepairCodeJob> => {
    return inferenceJobs.map(
        (inferenceJob): RepairCodeJob => {
            const intuitaRange: IntuitaRange = 'range' in inferenceJob
                ? inferenceJob.range
                : [
                    inferenceJob.lineNumber,
                    0,
                    inferenceJob.lineNumber,
                    lengths[inferenceJob.lineNumber] ?? 0,
                ];

            const range = buildIntuitaSimpleRange(
                separator,
                lengths,
                intuitaRange,
            );

            const jobHash = buildRepairCodeJobHash(
                fileName,
                inferenceJob,
            );

            const lineNumber = 'range' in inferenceJob
                ? inferenceJob.range[0]
                : inferenceJob.lineNumber;

            const title = `Repair code on line ${lineNumber+1}`;

            return {
                kind: JobKind.repairCode,
                fileName,
                hash: jobHash,
                title,
                range: intuitaRange,
                replacement: inferenceJob.replacement,
                version,
                fileText,
                simpleRange: range,
                separator,
            };
        },
    );
}