import { exec } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Diagnostic, DiagnosticChangeEvent, languages, Uri, window, workspace } from "vscode";
import { buildHash, isNeitherNullNorUndefined } from "../utilities";
import {ChildProcessWithoutNullStreams} from "child_process";
import { buildCodeRepairJobHash } from "../features/repairCode/jobHash";

const promisifiedExec = promisify(exec);

type UriEnvelope = Readonly<{
    uri: Uri,
    fsPath: string,
    diagnostics: Diagnostic[],
}>;

export const buildDidChangeDiagnosticsCallback = (
    onnxWrapperProcess: ChildProcessWithoutNullStreams,
) => async ({ uris }: DiagnosticChangeEvent) => {
    const { activeTextEditor } = window;

    if (!activeTextEditor) {
        console.error('There is no active text editor despite the changed diagnostics.');

        return;
    }

    const activeUri = activeTextEditor.document.uri.toString();

    if (activeUri.includes('.intuita')) {
        console.log('The files within the .intuita directory won\'t be inspected.');

        return;
    }

    const uriEnvelopes = uris
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
                const fsPath = workspaceFolder?.uri.fsPath;

                return {
                    uri,
                    diagnostics,
                    fsPath,
                };
            },
        )
        .filter<UriEnvelope>(
            (u): u is UriEnvelope => {
                return isNeitherNullNorUndefined(u.fsPath)
                    && u.diagnostics.length !== 0;
            },
        );

        await Promise.all(uriEnvelopes.map(
            async ({ uri, fsPath, diagnostics }) => {
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

                const vectorPath = join(
                    fsPath,
                    `/.intuita/${hash}/vectors`,
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

                const start = Date.now();

                await promisifiedExec(
                    'joern-parse --output=$PARSE_OUTPUT $PARSE_INPUT',
                    {
                        env: {
                            PARSE_INPUT: directoryPath,
                            PARSE_OUTPUT: cpgFilePath,
                        },
                    },
                );

                // joern-slice (pass the error range)

                const end = Date.now();

                console.log(`Wrote the CPG for ${uri.toString()} within ${end - start} ms`);

                const data = await promisifiedExec(
                    'joern-vectors --out $VECTOR_OUTPUT --features $VECTOR_INPUT',
                    {
                        env: {
                            VECTOR_INPUT: cpgFilePath,
                            VECTOR_OUTPUT: vectorPath,
                        }
                    }
                );

                for (const { range } of diagnostics) {
                    onnxWrapperProcess.stdin.write(JSON.stringify({
                        kind: 'infer',
                        fileName: uri.path,
                        range, // TODO convert to IntuitaRange
                        ...JSON.parse(data.stdout),
                    }));
                }                
            }
        ));
}
