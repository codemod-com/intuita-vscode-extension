import { exec, execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Diagnostic, DiagnosticChangeEvent, languages, Uri, window, workspace, WorkspaceFolder } from "vscode";
import { Configuration } from "../configuration";
import { Container } from "../container";
import { buildHash, isNeitherNullNorUndefined } from "../utilities";

type UriEnvelope = Readonly<{
    workspaceFolder: WorkspaceFolder,
    uri: Uri,
    diagnostics: Diagnostic[]
}>;

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

                const workspaceFolder = workspace.getWorkspaceFolder(uri);

                return {
                    uri,
                    diagnostics,
                    workspaceFolder,
                };
            },
        )
        .filter<UriEnvelope>(
            (u): u is UriEnvelope => {
                return isNeitherNullNorUndefined(u.workspaceFolder)
                    && u.diagnostics.length !== 0;
            },
        )
        .forEach(
            ({ uri, workspaceFolder }) => {
                const { fsPath } = workspaceFolder.uri;
                const hash = buildHash(uri.toString());

                const directoryPath = join(
                    fsPath,
                    `/.intuita/${hash}/`,
                );

                const filePath = join(
                    fsPath,
                    `/.intuita/${hash}/index.ts`,
                );

                const cpgFilePath = join(
                    fsPath,
                    `/.intuita/${hash}/cpg.bin`,
                );

                mkdirSync(
                    directoryPath,
                    { recursive: true, },
                );

                writeFileSync(
                    filePath,
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