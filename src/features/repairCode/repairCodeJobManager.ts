import {JobHash} from "../moveTopLevelNode/jobHash";
import {IntuitaRange} from "../../utilities";
import {JobKind} from "../../jobs";
import {JobManager} from "../../components/jobManager";

export type RepairCodeJob = Readonly<{
    kind: JobKind.repairCode,
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    replacement: string,
}>;

export class RepairCodeJobManager extends JobManager {
}
