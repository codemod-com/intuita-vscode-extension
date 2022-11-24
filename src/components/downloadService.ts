import Axios from 'axios';
import { Mode } from 'node:fs';
import { FileSystem, Uri } from 'vscode';
import { FileSystemUtilities } from './fileSystemUtilities';

export class RequestError extends Error {}
export class ForbiddenRequestError extends Error {}

export class DownloadService {
    #fileSystem: FileSystem;
    #fileSystemUtilities: FileSystemUtilities;

    constructor (
        fileSystem: FileSystem,
        fileSystemUtilities: FileSystemUtilities,
    ) {
        this.#fileSystem = fileSystem;
        this.#fileSystemUtilities = fileSystemUtilities;
    }

    async downloadFileIfNeeded(
		url: string,
		uri: Uri,
		chmod: Mode,
	): Promise<void> {
		const response = await Axios.head(url).catch((error) => {
			if (!Axios.isAxiosError(error)) {
				throw error;
			}

			const status = error.response?.status;

			if (status === 403) {
				throw new ForbiddenRequestError(
					`Could not make a request to ${url}: request forbidden`,
				);
			}

			throw new RequestError(`Could not make a request to ${url}`);
		});

		const lastModified = response.headers['last-modified'];
		const remoteModificationTime = lastModified
			? Date.parse(lastModified)
			: Date.now();

		const localModificationTime =
			await this.#fileSystemUtilities.getModificationTime(uri);

		if (localModificationTime < remoteModificationTime) {
			await this.#downloadFile(url, uri, chmod);
		}
	}

	async #downloadFile(url: string, uri: Uri, chmod: Mode): Promise<void> {
		const response = await Axios.get(url, { responseType: 'arraybuffer' });
		const content = new Uint8Array(response.data);

		await this.#fileSystem.writeFile(uri, content);

		await this.#fileSystemUtilities.setChmod(uri, chmod);
	}
}