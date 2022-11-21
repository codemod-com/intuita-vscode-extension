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
	Uri,
} from 'vscode';
import { MessageBus, MessageKind } from './messageBus';
import { join } from 'node:path';

const LOADING_MESSAGE = Buffer.from('// LOADING...');

type IntuitaFile = Readonly<{
	content: Uint8Array;
	permissions: FilePermission | null;
	ctime: number;
	mtime: number;
}>;

export class IntuitaFileSystem implements FileSystemProvider {
	#messageBus: MessageBus;
	readonly #emitter = new EventEmitter<FileChangeEvent[]>();
	readonly #files = new Map<string, IntuitaFile>();

	public readonly onDidChangeFile: Event<FileChangeEvent[]> =
		this.#emitter.event;

	public constructor(messageBus: MessageBus) {
		this.#messageBus = messageBus;
		this.#messageBus.subscribe((message) => {
			if (message.kind === MessageKind.writeFile) {
				setImmediate(() => {
					this.writeFile(message.uri, message.content, {
						create: true,
						overwrite: true,
						permissions: message.permissions,
					});
				});
			}

			if (message.kind === MessageKind.deleteFile) {
				setImmediate(() => {
					this.delete(message.uri);
				});
			}

			if (message.kind === MessageKind.changePermissions) {
				setImmediate(() => {
					this.#changePermissions(message.uri, message.permissions);
				});
			}
		});
	}

	watch(): Disposable {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return new Disposable(function () {});
	}

	stat(uri: Uri): FileStat {
		const now = Date.now();

		const fileName = uri.toString();

		const file = this.#files.get(fileName);

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

	readDirectory(): [string, FileType][] {
		return [];
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	createDirectory(): void {}

	public readNullableFile(uri: Uri): Uint8Array | null {
		const fileName = uri.toString();

		const file = this.#files.get(fileName);

		return file?.content ?? null;
	}

	readFile(uri: Uri): Uint8Array {
		const content = this.readNullableFile(uri);

		if (!content) {
			this.#messageBus.publish({
				kind: MessageKind.readingFileFailed,
				uri,
			});
		}

		return content ?? LOADING_MESSAGE;
	}

	writeFile(
		uri: Uri,
		content: Uint8Array,
		options: Readonly<{
			create: boolean;
			overwrite: boolean;
			// we added permissions
			permissions?: FilePermission | null;
		}>,
	): void {
		const now = Date.now();

		const fileName = uri.toString();

		const oldFile = this.#files.get(fileName);

		if (!oldFile && !options.create) {
			throw FileSystemError.FileNotFound(uri);
		}

		if (oldFile && options.create && !options.overwrite) {
			throw FileSystemError.FileExists(uri);
		}

		this.#files.set(fileName, {
			content,
			permissions: options.permissions ?? null,
			ctime: oldFile?.ctime ?? now,
			mtime: now,
		});

		const type = oldFile ? FileChangeType.Changed : FileChangeType.Created;

		this.#emitter.fire([
			{
				uri,
				type,
			},
		]);
	}

	delete(uri: Uri): void {
		const fileName = uri.toString();

		if (!this.#files.has(fileName)) {
			return;
		}

		this.#files.delete(fileName);

		this.#emitter.fire([
			{
				uri,
				type: FileChangeType.Deleted,
			},
		]);
	}

	rename(oldUri: Uri, newUri: Uri): void {
		const oldFileName = oldUri.toString();

		const file = this.#files.get(oldFileName);

		if (!file) {
			throw new Error('File not found.');
		}

		this.#files.set(newUri.toString(), file);
	}

	#changePermissions(uri: Uri, permissions: FilePermission | null): void {
		const fileName = uri.toString();

		const file = this.#files.get(fileName);

		if (!file) {
			throw FileSystemError.FileNotFound(uri);
		}

		this.#files.set(fileName, {
			...file,
			permissions,
		});

		this.#emitter.fire([
			{
				uri,
				type: FileChangeType.Changed,
			},
		]);
	}
}

export const buildJobUri = (job: { fileName: string; hash: string }): Uri => {
	const uri = Uri.file(job.fileName);

	const jobTitle = `proposedChange_${job.hash}`;

	const value = join(
		'intuita:/vfs/jobs/',
		uri.scheme,
		'/',
		uri.fsPath,
		'/',
		`${jobTitle}.ts`,
	);

	return Uri.parse(value, true);
};

export const buildFileUri = (uri: Uri): Uri => {
	const value = join('intuita:/vfs/files/', uri.scheme, '/', uri.fsPath);

	return Uri.parse(value, true);
};
