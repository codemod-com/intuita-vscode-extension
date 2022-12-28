import * as semver from 'semver';
import * as t from 'io-ts';
import { window, workspace } from "vscode";
import { buildTypeCodec } from "../utilities";
import { MessageBus, MessageKind } from '../components/messageBus';

const packageSettingsCodec = buildTypeCodec({
    devDependencies: t.union([
        t.record(t.string, t.string),
        t.undefined,
    ]),
    dependencies: t.union([
        t.record(t.string, t.string),
        t.undefined,
    ]),
});

type PackageSettings = t.TypeOf<typeof packageSettingsCodec>;

const getNextJsVersion = (packageSettings: PackageSettings): string | null => 
    packageSettings.dependencies?.['next'] ?? packageSettings.devDependencies?.['next'] ?? null;

export class DependencyService {
    #messageBus: MessageBus;

    constructor(
        messageBus: MessageBus,
    ) {
        this.#messageBus = messageBus;
    }

    async x() {
        const uris = await workspace.findFiles('**/package.json', 'node_modules/**', 100);

        for (const packageSettingsUri of uris) {
            console.log(packageSettingsUri.fsPath);
            const uint8Array = await workspace.fs.readFile(packageSettingsUri);
            const buffer = Buffer.from(uint8Array);
            const string = buffer.toString('utf8');
            const json = JSON.parse(string);

            const validation = packageSettingsCodec.decode(json);

            if ('left' in validation) {
                console.error(validation.left);
                continue;
            }

            const dependencyOldVersion = getNextJsVersion(validation.right);

            if (!dependencyOldVersion) {
                continue;
            }

            const satisfies = semver.satisfies('^13.0.0', dependencyOldVersion);

            if (satisfies) {
                continue;
            }

            const selectedItem = await window.showInformationMessage(
                `Your Next.js version (${dependencyOldVersion}) is outdated. Use codemods to upgrade your codebase.`,
                "Upgrade to ^13.0.0",
                "No, thanks"
            );

            this.#messageBus.publish({
                kind: MessageKind.showInformationMessage,
                packageSettingsUri,
                dependencyName: 'next',
                dependencyOldVersion: dependencyOldVersion,
                dependencyNewVersion: '^13.0.0',
            });
        }
    }
}