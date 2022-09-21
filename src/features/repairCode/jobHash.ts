import {buildHash} from "../../utilities";
import {JobHash} from "../moveTopLevelNode/jobHash";

export const buildRepairCodeJobHash = (
    fileName: string,
    lineNumber: number,
    replacement: string,
): JobHash => {
    const data = [
        fileName,
        String(lineNumber),
        replacement,
    ]
        .map((value) => String(value))
        .join(',');

    const hash = buildHash(data);

    return hash as JobHash;
};
