import prettyReporter from 'io-ts-reporters';
import { FileSystem, Uri } from 'vscode';
import { PersistedState, persistedStateCodec } from './codecs';

export const getPersistedState = async (
	fileSystem: FileSystem,
	getStorageUri: () => Uri | null,
): Promise<PersistedState | null> => {
	const uri = getStorageUri();

	if (!uri) {
		console.error('No storage URI found. We cannot read the state.');

		return null;
	}

	const localStateUri = Uri.joinPath(uri, 'localState.json');

	try {
		await fileSystem.stat(localStateUri);
	} catch {
		return null;
	}

	try {
		const content = await fileSystem.readFile(localStateUri);
		const buffer = Buffer.from(content);
		const str = buffer.toString();
		const json = JSON.parse(str);

		const persistedStateEither = persistedStateCodec.decode(json);

		if (persistedStateEither._tag === 'Left') {
			const report = prettyReporter.report(persistedStateEither);

			console.error(report);

			return null;
		}

		return persistedStateEither.right;
	} catch (error) {
		console.error(error);

		return null;
	}
};
