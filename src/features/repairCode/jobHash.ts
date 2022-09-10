import {buildHash, IntuitaRange} from "../../utilities";
import {JobHash} from "../moveTopLevelNode/jobHash";

export const buildRepairCodeJobHash = (
    fileName: string,
    range: IntuitaRange,
    replacement: string,
): JobHash => {
    const data = {
        fileName,
        range,
        replacement,
    };

    const hash = buildHash(
        JSON.stringify(data),
    );

    return hash as JobHash;
};
