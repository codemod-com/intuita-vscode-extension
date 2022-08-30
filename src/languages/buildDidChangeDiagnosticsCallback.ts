import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DiagnosticChangeEvent, languages, window, workspace } from "vscode";
import { Configuration } from "../configuration";
import { Container } from "../container";
import { buildHash } from "../utilities";

export const buildDidChangeDiagnosticsCallback = (
    configurationContainer: Container<Configuration>
) => ({ uris }: DiagnosticChangeEvent) => {
    const { activeTextEditor } = window;

    if (!activeTextEditor) {
        console.error('There is no active text editor despite the changed diagnostics.');
        
        return;
    }

    const configuration = configurationContainer.get();
    
    if (!configuration.joernAvailable) {
        console.error('You either use Windows or you have not installed Joern.');
        
        return;
    }

    const activeUri = activeTextEditor.document.uri.toString();

    if (activeUri.includes('.intuita')) {
        console.log('The files within the .intuita directory won\'t be inspected.');

        return;
    }

    uris
        .filter(
            (uri) => {
                return activeUri === uri.toString();
            },
        )
        .map(
            (uri) => {
                const diagnostics = languages
                    .getDiagnostics(uri)
                    .filter(
                        ({ source }) => source === 'ts'
                    );

                return {
                    uri,
                    diagnostics,
                };
            },
        )
        .filter(
            ({ diagnostics }) => {
                return diagnostics.length !== 0;
            },
        )
        .forEach(
            ({ uri }) => {
                if (uri.scheme !== 'file') {
                    console.error(`Could not evaluate the non-file uri: ${uri.toString()}`);
                    return;
                }

                const workspaceFolder = workspace.getWorkspaceFolder(uri);

                if (!workspaceFolder) {
                    console.error(`Could not recognize a workspace folder for the uri: ${uri.toString()}`);

                    return;
                }

                const hash = buildHash(uri.toString());

                const { fsPath } = workspaceFolder.uri;

                const directoryPath = join(
                    fsPath,
                    `/.intuita/${hash}/`,
                );

                const path = join(
                    fsPath,
                    `/.intuita/${hash}/index.ts`,
                );

                const cpgFilePath = join(
                    fsPath,
                    `/.intuita/${hash}/cpg.bin`,
                );

                mkdirSync(
                    directoryPath,
                    {
                        recursive: true,
                    },
                );

                writeFileSync(
                    path,
                    activeTextEditor.document.getText(),
                    { encoding: 'utf8', }
                );

                execSync(
                    'joern-parse --output=$JOERN_PROXY_OUTPUT $JOERN_PROXY_INPUT',
                    {
                        env: {
                            JOERN_PROXY_INPUT: directoryPath,
                            JOERN_PROXY_OUTPUT: cpgFilePath,
                        },
                    },
                );

                console.log(`Wrote the CPG for ${uri.toString()}`);
            }
        );
}