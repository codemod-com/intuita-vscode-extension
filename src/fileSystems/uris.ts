import { Uri } from "vscode"
import { FileNameHash } from "../features/moveTopLevelNode/fileNameHash";
import { JobHash } from "../features/moveTopLevelNode/jobHash"

export const buildJobUri = (
    jobHash: JobHash,
): Uri => {
    return Uri.parse(
        `intuita:/jobs/${jobHash}.ts`,
        true,
    );
};

export const buildFileUri = (
    fileNameHash: FileNameHash,
): Uri => {
    return Uri.parse(
        `intuita:/files/${fileNameHash}.ts`,
        true,
    );
};