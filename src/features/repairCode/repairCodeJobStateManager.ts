import {MessageBus} from "../../messageBus";
import {JobHash} from "../moveTopLevelNode/jobHash";
import {IntuitaRange} from "../../utilities";
import {JobKind} from "../../jobs";

type RepairCodeJob = Readonly<{
    kind: JobKind.repairCode,
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    replacement: string,
}>;

export class RepairCodeJobStateManager {

    public constructor(
        protected readonly _messageBus: MessageBus,
    ) {
    }
}
