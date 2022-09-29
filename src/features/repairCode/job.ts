import {JobHash} from "../moveTopLevelNode/jobHash";
import {IntuitaRange, IntuitaSimpleRange} from "../../utilities";
import {JobKind} from "../../jobs";

export type RepairCodeJob = Readonly<{
    kind: JobKind.repairCode,
    fileName: string,
    version: number,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    replacement: string,
    // new properties
    fileText: string,
    simpleRange: IntuitaSimpleRange,
    separator: string,
}>;
