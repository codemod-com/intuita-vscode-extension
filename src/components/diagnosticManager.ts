import {buildDiagnosticHash, DiagnosticHash} from "../hashes";
import {InferenceService} from "./inferenceService";
import {DiagnosticChangeEvent, languages, window, workspace} from "vscode";
import {buildHash, isNeitherNullNorUndefined} from "../utilities";
import {join} from "node:path";
import {mkdirSync, writeFileSync} from "node:fs";
import {promisify} from "node:util";
import {exec} from "node:child_process";

const promisifiedExec = promisify(exec);

export class DiagnosticManager {
    protected readonly _hashes: Set<DiagnosticHash> = new Set();

    public constructor(
        protected readonly _inferenceService: InferenceService,
    ) {
    }

    public clearHashes() {
        this._hashes.clear();
    }

    public async onDiagnosticChangeEvent(
        { uris }: DiagnosticChangeEvent,
    ): Promise<void> {
        const { activeTextEditor } = window;

        if (!activeTextEditor) {
            console.error('There is no active text editor despite the changed diagnostics.');

            return;
        }

        const stringUri = activeTextEditor.document.uri.toString();

        if (stringUri.includes('.intuita')) {
            console.log('The files within the .intuita directory won\'t be inspected.');

            return;
        }

        const { version } = activeTextEditor.document;

        const isFileTheSame = (): boolean => {
            return version === window.activeTextEditor?.document.version
                && stringUri === window.activeTextEditor.document.uri.toString();
        };

        const uri = uris.find((u) => stringUri === u.toString());

        if (!uri) {
            return;
        }

        const diagnostics = languages
            .getDiagnostics(uri)
            .filter(
                ({ source }) => source === 'ts'
            )
            .filter(
                (diagnostic) => !this._hashes.has(
                    buildDiagnosticHash(diagnostic)
                )
            );

        const workspaceFolder = workspace.getWorkspaceFolder(uri);
        const workspaceFsPath = workspaceFolder?.uri.fsPath;

        if (!isNeitherNullNorUndefined(workspaceFsPath) || diagnostics.length === 0) {
            return;
        }

        const hash = buildHash([
            stringUri,
            String(version),
        ].join(','));

        const text = activeTextEditor.document.getText();

        const directoryPath = join(
            workspaceFsPath,
            `/.intuita/${hash}/`,
        );

        const filePath = join(
            workspaceFsPath,
            `/.intuita/${hash}/index.ts`,
        );

        const cpgFilePath = join(
            workspaceFsPath,
            `/.intuita/${hash}/cpg.bin`,
        );

        const vectorPath = join(
            workspaceFsPath,
            `/.intuita/${hash}/vectors`,
        );

        mkdirSync(
            directoryPath,
            { recursive: true, },
        );

        writeFileSync(
            filePath,
            text,
            { encoding: 'utf8', }
        );

        const start = Date.now();

        await this._executeJoernParse(directoryPath, cpgFilePath);

        // joern-slice (pass the error range)

        const end = Date.now();

        console.log(`Wrote the CPG for ${uri.toString()} within ${end - start} ms`);

        if (!isFileTheSame()) {
            console.log('ABCD1')
            return;
        }

        const data = await this._executeJoernVectors(cpgFilePath, vectorPath);

        if (!isFileTheSame()) {
            console.log('ABCD2')
            return;
        }

        // TODO remove the .intuita / hash directory

        for (const diagnostic of diagnostics) {
            this._hashes.add(
                buildDiagnosticHash(diagnostic)
            );

            const { range } = diagnostic;

            await this._inferenceService.writeToStandardInput({
                kind: 'infer',
                fileName: uri.path,
                range: [
                    range.start.line,
                    range.start.character,
                    range.end.line,
                    range.end.character,
                ],
                // ...data,
                dimToFeature: [],
                vectors: [],
                objects: [],
                edges: [],
            });

            console.log('written')

            if (!isFileTheSame()) {
                return;
            }
        }
    }

    protected async _executeJoernParse(
        directoryPath: string,
        cpgFilePath: string,
    ): Promise<void> {
        await promisifiedExec(
            'joern-parse --output=$PARSE_OUTPUT $PARSE_INPUT',
            {
                env: {
                    PARSE_INPUT: directoryPath,
                    PARSE_OUTPUT: cpgFilePath,
                },
            },
        );
    }

    protected async _executeJoernVectors(
        cpgFilePath: string,
        vectorPath: string,
    ): Promise<any> {
        const { stdout } = await promisifiedExec(
            'joern-vectors --out $VECTOR_OUTPUT --features $VECTOR_INPUT',
            {
                env: {
                    VECTOR_INPUT: cpgFilePath,
                    VECTOR_OUTPUT: vectorPath,
                }
            }
        );

        return JSON.parse(stdout);
    }
}
