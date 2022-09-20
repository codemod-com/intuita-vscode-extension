import Axios from 'axios';
import {buildDiagnosticHash, DiagnosticHash} from "../hashes";
import {areRepairCodeCommandsAvailable, decodeOrThrow, InferCommand, inferredMessageCodec} from "./inferenceService";
import {DiagnosticChangeEvent, languages, Uri, window, workspace} from "vscode";
import {buildHash, isNeitherNullNorUndefined} from "../utilities";
import {join} from "node:path";
import {mkdir, writeFile } from "node:fs";
import {promisify} from "node:util";
import {exec} from "node:child_process";
import {MessageBus, MessageKind} from "./messageBus";

const promisifiedExec = promisify(exec);
const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

export class DiagnosticManager {
    protected readonly _hashes: Set<DiagnosticHash> = new Set();
    protected readonly _abortControllerMap: Map<string, AbortController> = new Map();
    protected readonly commandsAvailable: boolean;

    public constructor(
        protected readonly _messageBus: MessageBus,
    ) {
        this.commandsAvailable = areRepairCodeCommandsAvailable();

        this._messageBus.subscribe(
            (message) => {
                if (message.kind === MessageKind.textDocumentChanged) {
                    setImmediate(
                        () => {
                            this._onTextDocumentChanged(message.uri);
                        },
                    );
                }
            },
        );
    }

    public clearHashes() {
        this._hashes.clear();
    }

    protected _onTextDocumentChanged(uri: Uri): void {
        this.clearHashes();

        const stringUri = uri.toString();

        const abortController = this._abortControllerMap.get(
            stringUri
        );

        abortController?.abort();
    }

    public async onDiagnosticChangeEvent(
        event: DiagnosticChangeEvent,
    ): Promise<void> {
        if (!this.commandsAvailable) {
            return;
        }

        const { activeTextEditor } = window;

        if (!activeTextEditor) {
            console.error('There is no active text editor despite the changed diagnostics.');

            return;
        }

        const { uri, version, getText } = activeTextEditor.document;

        const stringUri = uri.toString();

        if (stringUri.includes('.intuita')) {
            console.log('The files within the .intuita directory won\'t be inspected.');

            return;
        }

        if(!event.uris.some((u) => stringUri === u.toString())) {
            return;
        }

        const diagnostics = this._getDiagnostics(uri);

        if (diagnostics.length === 0) {
            this._messageBus.publish({
                kind: MessageKind.noTypeScriptDiagnostics,
                uri,
            });

            return;
        }

        const workspaceFsPath = workspace.getWorkspaceFolder(uri)?.uri.fsPath;

        if (!isNeitherNullNorUndefined(workspaceFsPath)) {
            return;
        }

        const text = getText();

        const hash = buildHash([
            stringUri,
            String(version),
        ].join(','));

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

        const joernVectorPath = join(
            workspaceFsPath,
            `/.intuita/${hash}/joernVectors`,
        );

        const vectorPath = join(
            workspaceFsPath,
            `/.intuita/${hash}/vectors`,
        );

        const abortController = new AbortController();
        
        this._abortControllerMap.set(
            stringUri,
            abortController,
        );

        await promisifiedMkdir(
            directoryPath,
            {
                recursive: true,
            },
        );

        await promisifiedWriteFile(
            filePath,
            text,
            {
                signal: abortController.signal,
                encoding: 'utf8',
            },
        );

        const start = Date.now();

        await this._executeJoernParse(directoryPath, cpgFilePath, abortController.signal);

        // joern-slice (pass the error range)

        const end = Date.now();

        console.log(`Wrote the CPG for ${uri.toString()} within ${end - start} ms`);

        const data = await this._executeJoernVectors(cpgFilePath, joernVectorPath, abortController.signal);

        await promisifiedWriteFile(
            vectorPath,
            data,
            {
                signal: abortController.signal,
                encoding: 'utf8',
            },
        );

        // TODO remove the .intuita / hash directory
        for (const diagnostic of diagnostics) {
            this._hashes.add(
                buildDiagnosticHash(diagnostic)
            );

            const { range } = diagnostic;

            const command: InferCommand = {
                kind: 'infer',
                fileName: uri.path,
                range: [
                    range.start.line,
                    range.start.character,
                    range.end.line,
                    range.end.character,
                ],
                vectorPath,
            };

            const response = await this._infer(command, abortController.signal);

            const message = decodeOrThrow(
                inferredMessageCodec,
                (report) =>
                    new Error(`Could not decode the inferred message: ${report.join()}`),
                response.data,
            );

            this._messageBus.publish({
                kind: MessageKind.createRepairCodeJob,
                uri: Uri.parse(message.fileName),
                range: message.range,
                replacement: message.results[0] ?? '',
                version,
            });
        }
    }

    protected _getDiagnostics(uri: Uri) {
        return languages
            .getDiagnostics(uri)
            .filter(
                ({ source }) => source === 'ts'
            )
            .filter(
                (diagnostic) => !this._hashes.has(
                    buildDiagnosticHash(diagnostic)
                )
            );
    }

    protected async _executeJoernParse(
        directoryPath: string,
        cpgFilePath: string,
        signal: AbortSignal,
    ): Promise<void> {
        await promisifiedExec(
            'joern-parse --output=$PARSE_OUTPUT $PARSE_INPUT',
            {
                signal,
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
        signal: AbortSignal,
    ): Promise<string> {
        const { stdout } = await promisifiedExec(
            'joern-vectors --out $VECTOR_OUTPUT --features $VECTOR_INPUT',
            {
                signal,
                env: {
                    VECTOR_INPUT: cpgFilePath,
                    VECTOR_OUTPUT: vectorPath,
                }
            }
        );

        return stdout;
    }

    protected async _infer(
        command: InferCommand,
        signal: AbortSignal,
    ) {
        try {
            return await Axios.post(
                'http://localhost:4000/infer',
                command,
                {
                    signal,
                },
            );
        } catch (error) {
            if (Axios.isAxiosError(error)) {
                console.error(error.response?.data);
            }

            throw error;
        } 
    }
}
