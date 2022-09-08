import { buildHash, IntuitaRange } from "../../utilities";

export type JobHash = string & { __type: 'JobHash' };

export const buildMoveTopLevelNodeJobHash = (
    fileName: string,
    oldIndex: number,
    newIndex: number,
): JobHash => {
    const data = {
        fileName,
        oldIndex,
        newIndex,
    };

    const hash = buildHash(
        JSON.stringify(data),
    );

    return hash as JobHash;
}

export const buildCodeRepairJobHash = (
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
