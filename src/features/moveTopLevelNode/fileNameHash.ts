import { buildHash } from "../../utilities";

export type FileNameHash = string & { __type: 'FileNameHash' };

export const buildFileNameHash = (
    fileName: string,
): FileNameHash => {
    const hash = buildHash(
        fileName
    );

    return hash as FileNameHash;
}
