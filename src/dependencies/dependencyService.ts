import * as semver from 'semver';
import * as t from 'io-ts';
import { window, workspace } from "vscode";
import { buildTypeCodec } from "../utilities";

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
    constructor(
    ) {

    }

    async x() {
        const uris = await workspace.findFiles('**/package.json', 'node_modules/**', 100);

        for (const uri of uris) {
            console.log(uri.fsPath);
            const uint8Array = await workspace.fs.readFile(uri);
            const buffer = Buffer.from(uint8Array);
            const string = buffer.toString('utf8');
            const json = JSON.parse(string);

            const validation = packageSettingsCodec.decode(json);

            if ('left' in validation) {
                console.error(validation.left);
                continue;
            }

            const nextJsVersion = getNextJsVersion(validation.right);

            if (!nextJsVersion) {
                continue;
            }

            const satisfies = semver.satisfies('^13.0.0', nextJsVersion);

            if (!satisfies) {
                window.showInformationMessage('Hello World!' + nextJsVersion);
            }
        }

       
    }
}