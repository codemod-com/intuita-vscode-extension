import {
    Disposable,
    Event,
    EventEmitter,
    FileChangeEvent,
    FileChangeType,
    FilePermission,
    FileStat,
    FileSystemError,
    FileSystemProvider,
    FileType,
    Uri
} from "vscode";
import {MessageBus, MessageKind} from "./messageBus";
import {FileNameHash} from "../features/moveTopLevelNode/fileNameHash";
import {JobHash} from "../features/moveTopLevelNode/jobHash";
import {join} from "node:path";

const LOADING_MESSAGE = Buffer.from('// LOADING...');
export const FS_PATH_REG_EXP = /\/(jobs|files)\/([a-zA-Z0-9\-_]{27})\.(tsx|jsx|ts|js)/;

type IntuitaFile = Readonly<{
    content: Uint8Array,
    permissions: FilePermission | null,
    ctime: number,
    mtime: number,
}>;

export class IntuitaFileSystem implements FileSystemProvider {
    protected readonly _emitter = new EventEmitter<FileChangeEvent[]>();
    protected readonly _files = new Map<string, IntuitaFile>();

    public readonly onDidChangeFile: Event<FileChangeEvent[]> = this._emitter.event;

    public constructor(
        protected readonly _messageBus: MessageBus
    ) {
        this._messageBus.subscribe(
            (message) => {
                if (message.kind === MessageKind.writeFile) {
                    setImmediate(
                        () => {
                            this.writeFile(
                                message.uri,
                                message.content,
                                {
                                    create: true,
                                    overwrite: true,
                                    permissions: message.permissions,
                                },
                            );
                        },
                    );
                }

                if (message.kind === MessageKind.deleteFile) {
                    setImmediate(
                        () => {
                            this.delete(
                                message.uri
                            );
                        },
                    );
                }

                if (message.kind === MessageKind.changePermissions) {
                    setImmediate(
                        () => {
                            this._changePermissions(
                                message.uri,
                                message.permissions,
                            );
                        },
                    );
                }
            }
        )
    }

    watch(_: Uri): Disposable {
        return new Disposable(
            () => {}
        );
    }

    stat(uri: Uri): FileStat {
        const now = Date.now();

        const fileName = uri.toString();

        const file = this._files.get(
            fileName,
        );

        const ctime = file?.ctime ?? now;
        const mtime = file?.mtime ?? now;
        const content = file?.content ?? LOADING_MESSAGE;

        return {
            type: FileType.File,
            ctime,
            mtime,
            size: content.byteLength,
            permissions: file?.permissions ?? undefined,
        };
    }

    readDirectory(_: Uri): [string, FileType][] {
        return [];
    }

    createDirectory(_: Uri): void {

    }

    public readNullableFile(uri: Uri): Uint8Array | null {
        const fileName = uri.toString();

        const file = this._files.get(
            fileName,
        );

        return file?.content ?? null;
    }

    readFile(uri: Uri): Uint8Array {
        const content = this.readNullableFile(uri);

        if (!content) {
            this._messageBus.publish(
                {
                    kind: MessageKind.readingFileFailed,
                    uri,
                },
            );
        }

        return content ?? LOADING_MESSAGE;
    }

    writeFile(
        uri: Uri,
        content: Uint8Array,
        options: Readonly<{
            create: boolean;
            overwrite: boolean,
            // we added permissions
            permissions?: FilePermission | null,
        }>,
    ): void {
        const now = Date.now();

        const fileName = uri.toString();

        const oldFile = this._files.get(fileName);

        if (!oldFile && !options.create) {
            throw FileSystemError.FileNotFound(uri);
        }

        if (oldFile && options.create && !options.overwrite) {
            throw FileSystemError.FileExists(uri);
        }

        this._files.set(
            fileName,
            {
                content,
                permissions: options.permissions ?? null,
                ctime: oldFile?.ctime ?? now,
                mtime: now,
            },
        );

        const type = oldFile
            ? FileChangeType.Changed
            : FileChangeType.Created;

        this._emitter.fire(
            [
                {
                    uri,
                    type,
                },
            ],
        );
    }

    delete(uri: Uri): void {
        const fileName = uri.toString();

        if (!this._files.has(fileName)) {
            throw FileSystemError.FileNotFound(uri);
        }

        this._files.delete(
            fileName,
        );

        this._emitter.fire(
            [
                {
                    uri,
                    type: FileChangeType.Deleted,
                },
            ],
        );
    }

    rename(oldUri: Uri, newUri: Uri): void {
        const oldFileName = oldUri.toString();

        const file = this._files.get(
            oldFileName,
        );

        if (!file) {
            throw new Error("File not found.");
        }

        this._files.set(
            newUri.toString(),
            file,
        );
    }

    protected _changePermissions(
        uri: Uri,
        permissions: FilePermission | null,
    ): void {
        const fileName = uri.toString();

        const file = this._files.get(fileName);

        if (!file) {
            throw FileSystemError.FileNotFound(uri);
        }

        this._files.set(
            fileName,
            {
                ...file,
                permissions,
            },
        );

        this._emitter.fire(
            [
                {
                    uri,
                    type: FileChangeType.Changed,
                },
            ],
        );
    }
}

export const buildJobUri = (
    jobHash: JobHash,
): Uri => {
    return Uri.parse(
        `intuita:/jobs/${jobHash}.ts`,
        true,
    );
};
export const buildFileUri = (
    uri: Uri,
): Uri => {
    const value = join(
        'intuita:/files/',
        uri.scheme,
        '/',
        uri.fsPath,
    );

    return Uri.parse(
        value,
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
