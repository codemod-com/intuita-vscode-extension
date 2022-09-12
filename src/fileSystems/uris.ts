import {FilePermission, Uri} from "vscode"
import { FileNameHash } from "../features/moveTopLevelNode/fileNameHash";
import { JobHash } from "../features/moveTopLevelNode/jobHash"
import {FS_PATH_REG_EXP} from "./intuitaFileSystem";
import {assertsNeitherNullOrUndefined} from "../utilities";

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

export const destructIntuitaFileSystemUri = (uri: Uri) => {
    if (uri.scheme !== 'intuita') {
        return null;
    }

    const regExpExecArray = FS_PATH_REG_EXP.exec(uri.fsPath);

    if (!regExpExecArray) {
        return null;
    }

    const directory = regExpExecArray[1];

    if (directory === 'files') {
        return {
            directory: 'files' as const,
            fileNameHash: regExpExecArray[2] as FileNameHash,
        };
    }

    if (directory === 'jobs') {
        return {
            directory: 'jobs' as const,
            jobHash: regExpExecArray[2] as JobHash,
        };
    }

    return null;
};
