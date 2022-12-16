import prettyReporter from "io-ts-reporters";
import { FileSystem, Uri, WorkspaceFolder } from "vscode";
import { PersistedState, persistedStateCodec } from "./codecs";

export const getPersistedState = async (
    fileSystem: FileSystem,
    getWorkspaceFolders: () => ReadonlyArray<WorkspaceFolder>,
): Promise<PersistedState | null> => {
    const workspaceFolders = getWorkspaceFolders();

    const uri = workspaceFolders[0]?.uri;

    if (!uri) {
        console.error("No workspace folder found. We cannot persist the state anywhere.");

        return null;
    }

    const localStateUri = Uri.joinPath(uri, ".intuita", "localState.json");

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
}