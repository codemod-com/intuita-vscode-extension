import { EventEmitter, FileSystem, Uri } from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { buildCodemodMetadataHash, buildTypeCodec } from '../../utilities';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { DownloadService } from '../downloadService';
export class MetadataNotFoundError extends Error {}

const indexItemCodec = buildTypeCodec({
	kind: t.literal('README'),
	name: t.string,
	path: t.string,
});

const BASE_URL = `https://intuita-public.s3.us-west-1.amazonaws.com`;

export class TextDocumentContentProvider
	implements TextDocumentContentProvider
{
	private __codemodMetadata = new Map<string, string>();
	public onDidChangeEmitter = new EventEmitter<Uri>();
	public onDidChange = this.onDidChangeEmitter.event;

	constructor(
		private readonly __downloadService: DownloadService,
		private readonly __fileSystem: FileSystem,
		private readonly __globalStorageUri: Uri,
		private readonly __messageBus: MessageBus,
	) {
		this.__messageBus.subscribe(MessageKind.engineBootstrapped, () =>
			this.__onEngineBootstrapped(),
		);
	}

	public hasMetadata(uri: Uri): boolean {
		return this.__getCodemodMetadata(uri) !== null;
	}

	public provideTextDocumentContent(uri: Uri): string {
		return this.__getCodemodMetadata(uri) ?? '';
	}

	private async __onEngineBootstrapped() {
		try {
			await this.__fileSystem.createDirectory(this.__globalStorageUri);

			const indexJsonUri = Uri.joinPath(
				this.__globalStorageUri,
				'index.json',
			);

			const url = `${BASE_URL}/codemod-registry/index.json`;

			const downloaded =
				await this.__downloadService.downloadFileIfNeeded(
					url,
					indexJsonUri,
					null,
				);

			if (downloaded) {
				return;
			}

			const uint8array = await this.__fileSystem.readFile(indexJsonUri);
			const data = uint8array.toString();

			const validation = t
				.readonlyArray(indexItemCodec)
				.decode(JSON.parse(data));

			if (E.isLeft(validation)) {
				throw new Error('Could not decode the response');
			}

			for (const indexItem of validation.right) {
				const metadata = await this.__fetchCodemodMetadata(
					indexItem.path,
				);

				if (metadata === null) {
					continue;
				}

				const hash = buildCodemodMetadataHash(indexItem.name);

				this.__codemodMetadata.set(hash, metadata);

				const uri = Uri.parse(`codemod:${indexItem.name}.md`);

				this.onDidChangeEmitter.fire(uri);
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async __fetchCodemodMetadata(path: string): Promise<string | null> {
		try {
			const url = `${BASE_URL}/codemod-registry/${path}`;

			const uri = Uri.joinPath(this.__globalStorageUri, path);

			await this.__downloadService.downloadFileIfNeeded(url, uri, null);

			const uint8array = await this.__fileSystem.readFile(uri);
			return uint8array.toString();
		} catch (e) {
			return null;
		}
	}

	private __getCodemodMetadata(uri: Uri): string | null {
		const { path } = uri;

		const name = path.replace(/\.md$/, '');
		const hash = buildCodemodMetadataHash(name);

		const data = this.__codemodMetadata.get(hash) ?? null;

		if (data === null) {
			this.__readDataFromFileSystem(hash)
				.then((data) => {
					this.__codemodMetadata.set(hash, data);

					this.onDidChangeEmitter.fire(uri);
				})
				.catch((error) => {
					console.error(error);
				});

			return 'Wait until the Intuita VSCode Extension loads the codemod description';
		}

		return data;
	}

	private async __readDataFromFileSystem(hash: string): Promise<string> {
		const storageUri = Uri.joinPath(this.__globalStorageUri, `${hash}.md`);

		const uint8array = await this.__fileSystem.readFile(storageUri);

		return uint8array.toString();
	}
}
