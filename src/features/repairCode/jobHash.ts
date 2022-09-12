import {buildHash, IntuitaRange} from "../../utilities";
import {JobHash} from "../moveTopLevelNode/jobHash";

export const buildRepairCodeJobHash = (
    fileName: string,
    range: IntuitaRange,
): JobHash => {
    const data = [
        fileName,
        ...range,
    ]
        .map((value) => String(value))
        .join(',');

    const hash = buildHash(data);

    return hash as JobHash;
};
